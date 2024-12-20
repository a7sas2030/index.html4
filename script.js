// تهيئة المتغيرات العامة
let saudiData = [];
let usData = [];

// استرجاع البيانات المحفوظة
document.addEventListener('DOMContentLoaded', () => {
    // استرجاع البيانات من التخزين المحلي
    saudiData = JSON.parse(localStorage.getItem('saudiData')) || [];
    usData = JSON.parse(localStorage.getItem('usData')) || [];

    // تحديث الجداول
    updateTable('Saudi');
    updateTable('US');

    // تهيئة الوضع الليلي
    const checkbox = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        checkbox.checked = currentTheme === 'dark';
    }

    // تحديث السنة في الفوتر
    document.getElementById('year').textContent = new Date().getFullYear();

    // إضافة مستمعي الأحداث
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // مستمعي أحداث النموذج السعودي
    document.getElementById('profitFormSaudi').addEventListener('submit', (e) => handleFormSubmit(e, 'Saudi'));
    document.getElementById('calculateTotalSaudi').addEventListener('click', () => calculateTotal('Saudi'));
    document.getElementById('clearTableSaudi').addEventListener('click', () => clearTable('Saudi'));

    // مستمعي أحداث النموذج الأمريكي
    document.getElementById('profitFormUS').addEventListener('submit', (e) => handleFormSubmit(e, 'US'));
    document.getElementById('calculateTotalUS').addEventListener('click', () => calculateTotal('US'));
    document.getElementById('clearTableUS').addEventListener('click', () => clearTable('US'));

    // مستمعي أحداث التبديل بين النموذجين
    document.getElementById('saudiBtn').addEventListener('click', () => switchForm('saudi'));
    document.getElementById('usBtn').addEventListener('click', () => switchForm('us'));

    // مستمع حدث الوضع الليلي
    document.getElementById('checkbox').addEventListener('change', handleThemeSwitch);
}

// معالجة تقديم النموذج
function handleFormSubmit(e, market) {
    e.preventDefault();
    
    const day = document.getElementById(`day${market}`).value;
    const date = document.getElementById(`date${market}`).value;
    const stockName = document.getElementById(`stockName${market}`).value;
    const profit = parseFloat(document.getElementById(`profit${market}`).value);

    const entry = {
        day,
        date,
        stockName,
        profit,
        runningTotal: 0 // سيتم حسابه لاحقاً
    };

    if (market === 'Saudi') {
        saudiData.push(entry);
        localStorage.setItem('saudiData', JSON.stringify(saudiData));
    } else {
        usData.push(entry);
        localStorage.setItem('usData', JSON.stringify(usData));
    }

    updateTable(market);
    e.target.reset();
}

// تحديث الجدول
function updateTable(market) {
    const data = market === 'Saudi' ? saudiData : usData;
    const tbody = document.getElementById(`profitTableBody${market}`);
    const totalSum = document.getElementById(`totalSum${market}`);
    
    tbody.innerHTML = '';
    let runningTotal = 0;

    data.forEach((entry, index) => {
        // تحويل الربح إلى رقم في حالة كان نصاً
        const profit = typeof entry.profit === 'string' ? parseFloat(entry.profit) : entry.profit;
        runningTotal += profit;

        // تنسيق الأرقام بشكل صحيح
        const formattedProfit = market === 'Saudi' ? 
            Number(profit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال' :
            '$' + Number(profit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
        const formattedRunningTotal = market === 'Saudi' ?
            Number(runningTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال' :
            '$' + Number(runningTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.day}</td>
            <td>${entry.stockName}</td>
            <td>${formattedProfit}</td>
            <td>${formattedRunningTotal}</td>
        `;
        tbody.appendChild(row);
    });

    // تحديث المجموع الكلي مع التنسيق الصحيح
    const formattedTotal = market === 'Saudi' ?
        Number(runningTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال' :
        '$' + Number(runningTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    totalSum.textContent = formattedTotal;
}

// حساب المجموع
function calculateTotal(market) {
    const data = market === 'Saudi' ? saudiData : usData;
    const total = data.reduce((sum, entry) => {
        const profit = typeof entry.profit === 'string' ? parseFloat(entry.profit) : entry.profit;
        return sum + profit;
    }, 0);

    const formattedTotal = market === 'Saudi' ?
        Number(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال' :
        '$' + Number(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    alert(market === 'Saudi' ? 
        `المجموع الكلي: ${formattedTotal}` : 
        `Total Sum: ${formattedTotal}`
    );
}

// مسح الجدول
function clearTable(market) {
    if (confirm(market === 'Saudi' ? 
        'هل أنت متأكد من مسح جميع البيانات؟' : 
        'Are you sure you want to clear all data?')) {
        if (market === 'Saudi') {
            saudiData = [];
            localStorage.setItem('saudiData', JSON.stringify(saudiData));
        } else {
            usData = [];
            localStorage.setItem('usData', JSON.stringify(usData));
        }
        updateTable(market);
    }
}

// التبديل بين النموذجين
function switchForm(market) {
    const saudiForm = document.getElementById('saudiForm');
    const usForm = document.getElementById('usForm');
    const saudiBtn = document.getElementById('saudiBtn');
    const usBtn = document.getElementById('usBtn');

    if (market === 'saudi') {
        saudiForm.style.display = 'block';
        usForm.style.display = 'none';
        saudiBtn.classList.add('active');
        usBtn.classList.remove('active');
    } else {
        saudiForm.style.display = 'none';
        usForm.style.display = 'block';
        saudiBtn.classList.remove('active');
        usBtn.classList.add('active');
    }
}

// معالجة تبديل الوضع الليلي
function handleThemeSwitch(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}
