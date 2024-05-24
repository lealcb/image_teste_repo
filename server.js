  const express = require('express');
  const path = require('path');
  const fs = require('fs');
  const sharp = require('sharp');

  const app = express();
  const port = 3000;

  // Servir arquivos estáticos da pasta public
  app.use(express.static('public'));

  // Rota para a página inicial
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/views/index.html'));
  });

  // Rota para obter caminhos das imagens da biblioteca
  app.get('/getImages', (req, res) => {
      const imageDirectory = path.join(__dirname, 'public', 'images');

      // Lê o diretório de imagens
      fs.readdir(imageDirectory, (err, files) => {
          if (err) {
              console.error('Erro ao ler diretório de imagens:', err);
              res.status(500).send('Erro ao obter imagens.');
              return;
          }

          // Constrói os caminhos completos para as imagens
          const imagePaths = files.map(file => `/images/${file}`);
          res.json(imagePaths);
      });
  });

  // Rota para fazer o download de uma imagem
  app.get('/downloadImage/:filename', async (req, res) => {
      const imagePath = path.join(__dirname, 'public', 'images', req.params.filename);

      try {
          // Comprimir a imagem usando o Sharp
          const compressedImageBuffer = await sharp(imagePath)
              .jpeg({ quality: 80 }) // Ajuste a qualidade conforme necessário
              .toBuffer();

          // Responder com a imagem comprimida para download
          res.writeHead(200, {
              'Content-Type': 'image/jpeg',
              'Content-Disposition': `attachment; filename=${req.params.filename}_compressed.jpg`
          });
          res.end(compressedImageBuffer);
      } catch (error) {
          console.error('Erro ao comprimir a imagem:', error);
          res.status(500).send('Erro ao comprimir a imagem.');
      }
  });



  // Iniciar o servidor
  app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
  });
