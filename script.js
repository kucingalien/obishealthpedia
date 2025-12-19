// ==========================================
// 1. MOBILE MENU LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

// ==========================================
// 2. BMI CALCULATOR LOGIC
// ==========================================
function calculateBMI(e) {
    e.preventDefault();
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    
    if (!weightInput || !heightInput) return;

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    if (!weight || !height || weight <= 0 || height <= 0) {
        alert("Mohon masukkan angka yang valid.");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category = '';
    let advice = '';
    let badgeClass = '';
    let imageSrc = '';

    if (bmi < 18.5) {
        category = 'Kekurangan Berat Badan';
        advice = 'Perbanyak asupan nutrisi seimbang dan protein.';
        badgeClass = 'text-yellow-700 bg-yellow-100 border border-yellow-200';
        imageSrc = 'assets/cipeng.png';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal (Ideal)';
        advice = 'Pertahankan pola makan sehat dan olahraga teratur!';
        badgeClass = 'text-green-700 bg-green-100 border border-green-200';
        imageSrc = 'assets/standar.png';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Kelebihan Berat Badan';
        advice = 'Kurangi gula & lemak, tingkatkan aktivitas fisik.';
        badgeClass = 'text-orange-700 bg-orange-100 border border-orange-200';
        imageSrc = 'assets/gembrot.png';
    } else {
        category = 'Obesitas';
        advice = 'Sangat disarankan konsultasi ke dokter untuk program diet.';
        badgeClass = 'text-red-700 bg-white border border-red-200';
        imageSrc = 'assets/gembrot.png';
    }

    const defaultView = document.getElementById('defaultView');
    const resultContainer = document.getElementById('resultContainer');
    const bmiImageElement = document.getElementById('bmiImage');
    
    if (defaultView && resultContainer) {
        defaultView.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        // Reset animasi
        resultContainer.classList.remove('animate-fade-in');
        void resultContainer.offsetWidth; // Trigger reflow
        resultContainer.classList.add('animate-fade-in');
        
        document.getElementById('bmiValue').innerText = bmi;
        
        if(bmiImageElement) {
            bmiImageElement.src = imageSrc;
            bmiImageElement.style.display = 'block';
            bmiImageElement.onerror = function() {
                this.style.display = 'none'; // Sembunyikan jika gambar gagal dimuat
            };
        }

        const badge = document.getElementById('bmiStatusBadge');
        if (badge) {
            badge.innerText = category;
            badge.className = `inline-block px-8 py-3 rounded-full font-bold mb-6 shadow-md ${badgeClass}`;
        }
        
        document.getElementById('bmiAdvice').innerText = advice;
    }
}

// ==========================================
// 3. GAME MANAGER (SWITCHER)
// ==========================================
function showGame(type) {
    const menu = document.getElementById('gameMenu');
    const foodGame = document.getElementById('foodGame');
    const habitGame = document.getElementById('habitGame');

    if (menu) menu.classList.add('hidden');
    
    if (type === 'food' && foodGame) {
        foodGame.classList.remove('hidden');
        // Reset state jika perlu
        document.getElementById('gameStartScreen').classList.remove('hidden');
        document.getElementById('gamePlayScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
    } else if (type === 'habit' && habitGame) {
        habitGame.classList.remove('hidden');
        // Reset state
        document.getElementById('habitStartScreen').classList.remove('hidden');
        document.getElementById('habitPlayScreen').classList.add('hidden');
        document.getElementById('habitResultScreen').classList.add('hidden');
    }
}

function backToMenu() {
    const menu = document.getElementById('gameMenu');
    const foodGame = document.getElementById('foodGame');
    const habitGame = document.getElementById('habitGame');

    if (foodGame) foodGame.classList.add('hidden');
    if (habitGame) habitGame.classList.add('hidden');
    if (menu) menu.classList.remove('hidden');
}

// ==========================================
// 4. GAME 1: PILIH MAKANAN SEHAT
// ==========================================
const foodData = [
    { options: [{ text: "Apel", icon: "🍎", isHealthy: true }, { text: "Burger", icon: "🍔", isHealthy: false }] },
    { options: [{ text: "Soda", icon: "🥤", isHealthy: false }, { text: "Air Putih", icon: "💧", isHealthy: true }] },
    { options: [{ text: "Brokoli", icon: "🥦", isHealthy: true }, { text: "Pizza", icon: "🍕", isHealthy: false }] },
    { options: [{ text: "Kentang Goreng", icon: "🍟", isHealthy: false }, { text: "Jagung Rebus", icon: "🌽", isHealthy: true }] },
    { options: [{ text: "Ikan Bakar", icon: "🐟", isHealthy: true }, { text: "Donat", icon: "🍩", isHealthy: false }] }
];

let foodCurrentQuestion = 0;
let foodScore = 0;
let isFoodGameActive = false;

function startGame() {
    foodCurrentQuestion = 0;
    foodScore = 0;
    isFoodGameActive = true;

    document.getElementById('gameStartScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('gamePlayScreen').classList.remove('hidden');
    document.getElementById('score').innerText = foodScore;
    
    loadQuestion();
}

function loadQuestion() {
    if (foodCurrentQuestion >= foodData.length) {
        endGame();
        return;
    }

    const data = foodData[foodCurrentQuestion];
    const btnA = document.getElementById('btnOptionA');
    const btnB = document.getElementById('btnOptionB');
    
    // Reset styles
    const defaultClass = "game-option-card bg-white border-2 border-red-100 hover:border-coral rounded-2xl p-6 transition transform hover:scale-105 group relative overflow-hidden w-full shadow-sm";
    btnA.className = defaultClass;
    btnB.className = defaultClass;
    
    document.getElementById('questionCount').innerText = foodCurrentQuestion + 1;
    document.getElementById('feedback').innerText = "";

    // Randomize position
    if (Math.random() > 0.5) {
        setBtnContent(btnA, data.options[0]);
        setBtnContent(btnB, data.options[1]);
    } else {
        setBtnContent(btnA, data.options[1]);
        setBtnContent(btnB, data.options[0]);
    }
}

function setBtnContent(btn, option) {
    const iconDiv = btn.querySelector('div');
    const textP = btn.querySelector('p');
    if (iconDiv) iconDiv.innerText = option.icon;
    if (textP) textP.innerText = option.text;
    btn.dataset.healthy = option.isHealthy;
}

function checkAnswer(btnIndex) {
    if (!isFoodGameActive) return;
    
    const btnId = btnIndex === 0 ? 'btnOptionA' : 'btnOptionB';
    const selectedBtn = document.getElementById(btnId);
    const isCorrect = selectedBtn.dataset.healthy === 'true';
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        foodScore += 20;
        document.getElementById('score').innerText = foodScore;
        selectedBtn.classList.remove('bg-white', 'border-red-100');
        selectedBtn.classList.add('correct-choice');
        feedback.innerText = "Benar! 🎉 +20 Poin";
        feedback.className = "h-8 mt-6 font-bold text-lg text-green-600 animate-bounce";
    } else {
        selectedBtn.classList.remove('bg-white', 'border-red-100');
        selectedBtn.classList.add('wrong-choice');
        feedback.innerText = "Ups Salah! 😢 0 Poin";
        feedback.className = "h-8 mt-6 font-bold text-lg text-red-500 animate-pulse";
    }

    isFoodGameActive = false; // Prevent double clicks

    setTimeout(() => {
        foodCurrentQuestion++;
        if (foodCurrentQuestion < foodData.length) {
            isFoodGameActive = true;
            loadQuestion();
        } else {
            endGame();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('gamePlayScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('finalScore').innerText = foodScore;
}

// ==========================================
// 5. GAME 2: DAILY HABIT CHALLENGE
// ==========================================
const habitData = [
    { options: [{ text: "Sarapan bubur ayam (tanpa kerupuk)", score: 10 }, { text: "Skip sarapan", score: -10 }, { text: "Minum air putih saat bangun", score: 10 }, { text: "Makan gorengan", score: -10 }] },
    { options: [{ text: "Naik tangga", score: 15 }, { text: "Naik lift", score: -5 }, { text: "Jalan kaki sore", score: 15 }, { text: "Main HP 3 jam", score: -15 }] },
    { options: [{ text: "Makan sayur bayam", score: 10 }, { text: "Makan fast food", score: -10 }, { text: "Minum es teh manis", score: -15 }, { text: "Jus buah tanpa gula", score: 10 }] },
    { options: [{ text: "Ngemil keripik", score: -10 }, { text: "Ngemil buah", score: 10 }, { text: "Minum boba", score: -15 }, { text: "Tidur jam 9 malam", score: 10 }] },
    { options: [{ text: "Lari pagi", score: 20 }, { text: "Begadang", score: -20 }, { text: "Makan malam porsi kecil", score: 10 }, { text: "Makan mie instan malam", score: -15 }] },
    { options: [{ text: "Meditasi", score: 10 }, { text: "Marah-marah", score: -10 }, { text: "Coklat hitam", score: 5 }, { text: "Kopi gula aren", score: -15 }] },
    { options: [{ text: "Timbang berat badan", score: 5 }, { text: "Cheat day berlebihan", score: -20 }, { text: "Masak sendiri", score: 15 }, { text: "Delivery makanan", score: -10 }] }
];

let currentHabitDay = 1;
let totalHabitScore = 0;

function startHabitGame() {
    currentHabitDay = 1;
    totalHabitScore = 0;
    
    document.getElementById('habitStartScreen').classList.add('hidden');
    document.getElementById('habitResultScreen').classList.add('hidden');
    document.getElementById('habitPlayScreen').classList.remove('hidden');
    
    updateHabitUI();
}

function updateHabitUI() {
    // Validasi agar tidak error jika array habis
    if (currentHabitDay > habitData.length) {
        showHabitResult();
        return;
    }

    document.getElementById('dayCount').innerText = currentHabitDay;
    document.getElementById('habitScore').innerText = totalHabitScore;
    
    const feedbackDiv = document.getElementById('habitFeedback');
    feedbackDiv.classList.add('hidden');
    feedbackDiv.innerHTML = '';
    
    const nextBtn = document.getElementById('habitNextBtn');
    nextBtn.innerText = "Konfirmasi Pilihan";
    nextBtn.onclick = submitHabitDay;
    nextBtn.disabled = false;
    nextBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
    nextBtn.classList.add('bg-coral', 'hover:bg-red-500');

    const optionsContainer = document.getElementById('habitOptions');
    optionsContainer.innerHTML = '';

    const dailyData = habitData[currentHabitDay - 1];

    if (dailyData && dailyData.options) {
        dailyData.options.forEach((opt, index) => {
            const div = document.createElement('div');
            // Ganti border slate dengan red-100 (putih pink)
            div.className = "flex items-center p-4 border-2 border-red-100 rounded-xl bg-white hover:border-coral transition cursor-pointer select-none group";
            div.onclick = function(e) {
                // Mencegah double trigger jika klik langsung pada checkbox
                if (e.target.type !== 'checkbox') {
                    const cb = this.querySelector('input');
                    cb.checked = !cb.checked;
                }
                
                // Limit to 3 choices
                const checkedCount = optionsContainer.querySelectorAll('input:checked').length;
                if (checkedCount > 3) {
                    const cb = this.querySelector('input');
                    // Jika baru saja dicentang dan melebihi batas, batalkan
                    if (cb.checked) {
                        cb.checked = false;
                        alert("Maksimal pilih 3 aktivitas per hari ya!");
                    }
                }
                
                // Visual feedback: Ubah warna border jika dipilih
                if (this.querySelector('input').checked) {
                    this.classList.add('border-coral', 'bg-red-50');
                    this.classList.remove('border-red-100', 'bg-white');
                } else {
                    this.classList.remove('border-coral', 'bg-red-50');
                    this.classList.add('border-red-100', 'bg-white');
                }
            };

            div.innerHTML = `
                <input type="checkbox" id="habit-${index}" value="${opt.score}" class="w-5 h-5 text-coral rounded border-gray-300 focus:ring-coral pointer-events-none">
                <label for="habit-${index}" class="ml-3 text-slate-600 text-sm font-bold cursor-pointer pointer-events-none">${opt.text}</label>
            `;
            optionsContainer.appendChild(div);
        });
    }
}

function submitHabitDay() {
    const checkedBoxes = document.querySelectorAll('#habitOptions input:checked');
    
    if (checkedBoxes.length === 0) {
        alert("Pilih minimal 1 aktivitas dong!");
        return;
    }

    let dailyScore = 0;
    checkedBoxes.forEach(cb => {
        dailyScore += parseInt(cb.value);
    });

    totalHabitScore += dailyScore;
    document.getElementById('habitScore').innerText = totalHabitScore;

    // Show Feedback
    const feedbackDiv = document.getElementById('habitFeedback');
    feedbackDiv.classList.remove('hidden');
    
    // Disable inputs after submit
    const allOptions = document.querySelectorAll('#habitOptions > div');
    allOptions.forEach(div => div.onclick = null);

    if (dailyScore > 10) {
        feedbackDiv.innerHTML = `<span class="font-bold text-green-600 block mb-1">Hebat! 👍</span> Pilihanmu hari ini sangat sehat (+${dailyScore} Poin).`;
    } else if (dailyScore > 0) {
        feedbackDiv.innerHTML = `<span class="font-bold text-orange-500 block mb-1">Lumayan... 🤔</span> Tapi bisa lebih baik lagi (+${dailyScore} Poin).`;
    } else {
        feedbackDiv.innerHTML = `<span class="font-bold text-red-500 block mb-1">Waduh! ⚠️</span> Pilihanmu berisiko obesitas (${dailyScore} Poin). Kurangi ya!`;
    }

    // Change button to next
    const nextBtn = document.getElementById('habitNextBtn');
    
    if (currentHabitDay < 7) {
        nextBtn.innerText = "Lanjut Hari Berikutnya";
        nextBtn.onclick = function() {
            currentHabitDay++;
            updateHabitUI();
        };
    } else {
        nextBtn.innerText = "Lihat Hasil Akhir";
        nextBtn.onclick = showHabitResult;
    }
}

function showHabitResult() {
    document.getElementById('habitPlayScreen').classList.add('hidden');
    document.getElementById('habitResultScreen').classList.remove('hidden');
    
    const finalScoreEl = document.getElementById('habitFinalScore');
    const resultText = document.getElementById('habitResultText');
    const icon = document.getElementById('habitResultIcon');
    
    finalScoreEl.innerText = totalHabitScore;

    if (totalHabitScore >= 100) {
        icon.innerText = "🏆";
        resultText.innerText = "Luar biasa! Kamu sudah memiliki pola hidup yang sangat sehat. Pertahankan kebiasaan ini untuk menjauhkan diri dari risiko obesitas.";
    } else if (totalHabitScore >= 50) {
        icon.innerText = "⚖️";
        resultText.innerText = "Cukup baik. Kamu sudah sadar kesehatan, tapi masih sering tergoda kebiasaan buruk. Coba kurangi camilan manis dan lebih banyak gerak ya!";
    } else {
        icon.innerText = "⚠️";
        resultText.innerText = "Hati-hati! Gaya hidupmu saat ini berisiko tinggi menyebabkan obesitas. Mulailah perubahan kecil seperti minum air putih lebih banyak dan kurangi begadang.";
    }
}

// ==========================================
// 6. MODAL & CONSULTATION LOGIC
// ==========================================
// Data Detail Faktor
const factorData = {
    polaMakan: {
        title: "POLA MAKAN BURUK",
        icon: '<i class="fa-solid fa-burger"></i>',
        desc: "Mengonsumsi kalori yang lebih tinggi daripada yang dibakar oleh tubuh seringkali berasal dari makanan tinggi gula, lemak jenuh, dan rendah serat (misalnya, makanan cepat saji, minuman manis, camilan olahan). Pola makan seperti ini menyebabkan penumpukan lemak berlebih."
    },
    stress: {
        title: "STRESS & KEBIASAAN",
        icon: '<i class="fa-solid fa-brain"></i>',
        desc: "Stres kronis memicu pelepasan hormon kortisol yang dapat meningkatkan nafsu makan dan mendorong tubuh menumpuk lemak, terutama di area perut. Selain itu, kurang tidur dapat mengganggu keseimbangan hormon pengatur nafsu makan."
    },
    lingkungan: {
        title: "LINGKUNGAN",
        icon: '<i class="fa-solid fa-city"></i>',
        desc: "Faktor ini merujuk pada pengaruh eksternal di sekitar kamu, sering disebut lingkungan 'obesogenik', di mana makanan tidak sehat mudah diakses, berukuran besar, dan murah, sementara kesempatan untuk beraktivitas fisik terbatas."
    },
    genetik: {
        title: "GENETIK",
        icon: '<i class="fa-solid fa-dna"></i>',
        desc: "Faktor genetik dapat memengaruhi bagaimana tubuh menyimpan lemak, bagaimana metabolisme bekerja, dan bagaimana nafsu makan diatur. Namun, gaya hidup memainkan peran yang lebih besar daripada gen semata."
    },
    kurangGerak: {
        title: "KURANG GERAK",
        icon: '<i class="fa-solid fa-person-walking-arrow-right"></i>',
        desc: "Gaya hidup yang malas gerak atau bahasa gaulnya mager dan minim olahraga menyebabkan tubuh membakar kalori jauh lebih sedikit, memperburuk ketidakseimbangan kalori yang memicu penumpukan lemak."
    }
};

function openFactorModal(key) {
    const modal = document.getElementById('detailModal');
    const data = factorData[key];
    if (data && modal) {
        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalIcon').innerHTML = data.icon;
        document.getElementById('modalDesc').innerText = data.desc;
        modal.classList.remove('hidden');
    }
}

function closeFactorModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hidden');
}

// Konsultasi Dokter
function consultDoctor(doctorName) {
    const message = `Halo, saya ingin berkonsultasi dengan ${doctorName} mengenai gizi dan diet.`;
    const whatsappUrl = `https://wa.me/6285819513747?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank'); 
}