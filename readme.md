
```markdown
# SnapTik API

SnapTik API adalah API yang dibuat untuk mengunduh konten TikTok seperti video dan foto tanpa watermark menggunakan SnapTik service. API ini dibuat dengan Node.js dan Express, dan menggunakan Snaptik client untuk memproses URL TikTok.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [POST /api](#post-api)
- [Running the Application](#running-the-application)
- [Example Request](#example-request)
- [License](#license)

## Installation

1. Clone repositori ini ke dalam direktori lokal:

```bash
git clone https://github.com/your-username/snaptik-api.git
cd snaptik-api
```

2. Install dependensi:

```bash
npm install
```

## Usage

Untuk menggunakan API ini, Anda perlu menjalankan server Express dan mengirimkan permintaan HTTP POST ke endpoint `/api` dengan URL TikTok.

### API Endpoints

#### POST `/api`

Endpoint ini digunakan untuk mengunduh video atau foto dari URL TikTok yang diberikan. Server akan mengembalikan metadata mengenai media tersebut, termasuk URL untuk mengunduhnya.

- **Request Body**:
  - `url` (string): URL TikTok yang ingin diunduh (misalnya `https://www.tiktok.com/@username/video/video_id`).

- **Response**:
  - Jika berhasil, respons akan berisi metadata media yang ditemukan.
  - Jika gagal, respons akan berisi pesan kesalahan.

##### Response Example:

```json
{
  "status": "success",
  "data": {
    "type": "video",
    "data": {
      "sources": [
        {
          "url": "https://example.com/video.mp4"
        }
      ]
    }
  }
}
```

##### Error Response Example:

```json
{
  "status": "error",
  "error": "URL is required"
}
```

## Running the Application

Setelah instalasi, Anda dapat menjalankan aplikasi dengan perintah:

```bash
npm start
```

Server akan berjalan di `http://localhost:5000`.

## Example Request

Berikut adalah contoh menggunakan cURL untuk mengirimkan permintaan POST ke API:

```bash
curl -X POST http://localhost:5000/api \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.tiktok.com/@username/video/video_id"}'
```

Anda juga dapat menggunakan Postman atau alat serupa untuk mengirim permintaan POST ke `http://localhost:5000/api` dengan body seperti berikut:

```json
{
  "url": "https://www.tiktok.com/@username/video/video_id"
}
```

## License

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
```

### Penjelasan Struktur:
1. **Installation**: Menjelaskan cara mengunduh dan menginstal dependensi proyek.
2. **Usage**: Cara menggunakan API ini, termasuk cara mengakses endpoint yang disediakan.
3. **API Endpoints**: Menyediakan informasi tentang endpoint yang dapat digunakan oleh pengguna untuk mengunduh media dari TikTok.
4. **Running the Application**: Langkah-langkah untuk menjalankan aplikasi server lokal.
5. **Example Request**: Menyediakan contoh cara mengirimkan permintaan HTTP POST menggunakan cURL atau alat lain.
6. **License**: Informasi lisensi yang digunakan dalam proyek ini.

Dokumentasi ini memberikan gambaran yang jelas tentang cara menginstal, mengonfigurasi, dan menggunakan API SnapTik di dalam aplikasi Anda.