// Use require to import the axios library
const axios = require('axios');

// This is the main serverless function
module.exports = async (req, res) => {
    // Get the target URL from the query string (e.g., /api/proxy?url=http://example.com)
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.status(400).send('Error: "url" query parameter is required.');
        return;
    }

    try {
        // Set headers to allow cross-origin requests (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // Handle pre-flight OPTIONS requests for CORS
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        // Fetch the content from the target URL as a stream
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            // Pass along some common headers to make the request look more legitimate
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': targetUrl
            }
        });

        // Pipe the response stream directly to the client
        response.data.pipe(res);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).send(`Error fetching the URL: ${error.message}`);
    }
};
