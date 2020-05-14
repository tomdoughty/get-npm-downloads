const axios = require('axios');

(async () => {
  try {
    const { data } = await axios('https://api.github.com/repos/nhsuk/nhsuk-frontend/releases');

    const promises = data.map(async ({ id, name, html_url, published_at, assets }, index) => {
      const nextRelease = data[index-1];
      const start = published_at;
      const end = nextRelease ? nextRelease.published_at : new Date().toISOString();
      const { data: { downloads: npmDownloads } } = await axios(`https://api.npmjs.org/downloads/point/${start.split('T')[0]}:${end.split('T')[0]}/nhsuk-frontend`);

      return {
        id,
        name,
        html_url,
        published_at,
        gitDownloads: assets[0].download_count,
        npmDownloads
      };
    });

    console.log(await Promise.all(promises));
    
  } catch (error) {
    console.log('Error:', error);
  }
})();
