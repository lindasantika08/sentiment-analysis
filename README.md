Proyek ini adalah aplikasi Dashboard Analisis Sentimen berbasis Vue3 + Typescript + Pinia. Dashboard menampilkan visualisasi data berupa Pie Chart, Bar Chart, Column Chart, Histogram, serta Tabel Sentimen yang bisa difilter dan dicari.

Cara Menjalankan Proyek:
1. Clone Repository git "git clone https://github.com/lindasantika08/sentiment-analysis.git"
2. install dependencies "npm install"
3. jalankan project dalam development lalu buka di browser "http://localhost:5173"

Fitur-Fitur:
1. **Fitur Filter Channel** yang mana pengguna bisa menampilkan channel yang hanya ingin dilihat informasinya
2. **Pencarian Channel** digunakan untuk mencari channel yang ingin dicari
3. **Visualisasi Data** dengan grafik **Pie Chart**, **Column Chart**, **Bar Chart**, dan **Histogram**. Setiap chart bisa diperjelas informasi jumlah yang ada di dalam chartnya dengan mengarahkan kursor ke arah garfik yang dituju.
4. **Modal Chart Interaktif** pada pemilihan chart yang dipilih dan bisa menampilkan modal chart yang lebih besar dan smooth animation.
5. **Responsive UI** karena layout menggunakan TailwindCSS.

Teknologi dan Library yang digunakan:
1. Vue 3 sebagai Frontend Framework
2. Pinia sebagai state management
3. TypeScript untuk type-safety
4. ApexChart digunakan untuk Charting Library
5. TailwindCSS sebagai Styling

Asumsi:
1. Semua data yang ditampilkan sesuai dengan data yang ada di response.json agar memperlihatkan kesesuaian data yang diberikan dan yang ditampilkan.
2. Urutan layout dibentuk seperti itu karena sesuai dengan letak untuk mudah dibaca dan menyesuaikan dengan fokus pengguna saat melihat visual yang ditampilkan.
3. Filtering masih bisa dikembangkan misal dengan memilih filter berdasarkan jumlah positif, negatif, atau netral.

Berikut contoh tampilan dari dekstop dan handphone.

![WhatsApp Image 2025-08-31 at 22 46 27_1fc559ab](https://github.com/user-attachments/assets/94dc76d0-e98c-4c35-b8f4-d02efe6743ee)
<img width="1920" height="1025" alt="Screenshot (4180)" src="https://github.com/user-attachments/assets/6b1e615b-b1ce-4030-bc5f-09a0cd760119" />
![WhatsApp Image 2025-08-31 at 22 46 27_28d16d4d](https://github.com/user-attachments/assets/21bbbad6-c7ee-433a-bfcc-ee673147dad7)
