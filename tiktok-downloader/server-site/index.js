const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Resolve URL pendek TikTok ke URL panjang
async function resolveTikTokUrl(shortUrl) {
  try {
    const res = await axios.get(shortUrl, { maxRedirects: 5 });
    return res.request.res.responseUrl;
  } catch (err) {
    throw new Error('Gagal resolve URL TikTok pendek.');
  }
}

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  try {
    const realUrl = await resolveTikTokUrl(url);
    console.log('Resolved URL:', realUrl);

    // Ganti TikMate dengan Tikwm API
    const response = await axios.get('https://tikwm.com/api/', {
      params: { url: realUrl }
    });

    const { data } = response.data;

    if (!data || !data.play) {
      return res.status(400).json({ error: 'Video tidak ditemukan.' });
    }

    res.json({
      videoUrl: data.play,
      title: data.title,
      musicUrl: data.music,
      author: data.author.nickname,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil video.' });
  }
});

app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
