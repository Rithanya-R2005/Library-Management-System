// Catalog JavaScript for Library Management System

document.addEventListener('DOMContentLoaded', () => {
    // Handle book cover image loading
    const bookCovers = document.querySelectorAll('.book-cover-img');
    bookCovers.forEach(img => {
        img.onerror = function() {
            // If the local image fails to load, the onerror attribute in HTML will use the fallback URL
            console.log(`Image failed to load: ${img.src}`);
        };
        
        img.onload = function() {
            // Image loaded successfully
            console.log(`Image loaded successfully: ${img.src}`);
        };
    });
    
    const categories = [
        { id: 'fiction', name: 'Fiction' },
        { id: 'non-fiction', name: 'Non-Fiction' },
        { id: 'science', name: 'Science' },
        { id: 'technology', name: 'Technology' },
        { id: 'history', name: 'History' },
        { id: 'philosophy', name: 'Philosophy' }
    ];

    // State
    let currentCategory = 'all';
    let currentSearch = '';
    let currentPage = 1;
    const perPage = 12;

    const params = new URLSearchParams(window.location.search);
    currentSearch = params.get('q')?.toLowerCase() || '';
    currentCategory = params.get('category') || 'all';

    const categoryBar = document.getElementById('categoryBar');
    const booksContainer = document.getElementById('booksContainer');

    renderCategories();
    setupBookActions();

    function renderCategories() {
        if (!categoryBar) return;
        categoryBar.innerHTML = '';
        const allBtn = createCategoryButton('all', 'All');
        if (currentCategory === 'all') allBtn.classList.add('active');
        categoryBar.appendChild(allBtn);
        categories.forEach(cat => {
            const btn = createCategoryButton(cat.id, cat.name);
            if (currentCategory === cat.id) btn.classList.add('active');
            categoryBar.appendChild(btn);
        });
    }

    function createCategoryButton(id, name) {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.category = id;
        
        // Create image element for category button
        let imgSrc = '';
        if (id === 'fiction') imgSrc = 'images/books/great-gatsby.svg';
        else if (id === 'non-fiction') imgSrc = 'images/books/brief-history.svg';
        else if (id === 'science') imgSrc = 'images/books/brief-history.svg';
        else if (id === 'technology') imgSrc = 'images/books/art-of-programming.svg';
        else if (id === 'history') imgSrc = 'images/books/republic.svg';
        else if (id === 'philosophy') imgSrc = 'images/books/republic.svg';
        else if (id === 'all') imgSrc = 'images/book-icon.svg';
        
        if (imgSrc) {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = name;
            img.className = 'category-icon';
            btn.appendChild(img);
        }
        
        const text = document.createElement('span');
        text.textContent = name;
        btn.appendChild(text);
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = id;
            currentPage = 1;
            filterBooks();
        });
        return btn;
    }

    function filterBooks() {
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach(item => {
            const subject = item.querySelector('.subject').textContent.toLowerCase();
            const title = item.querySelector('h3').textContent.toLowerCase();
            const author = item.querySelector('.author').textContent.toLowerCase();
            
            let show = true;
            
            // Filter by category
            if (currentCategory !== 'all' && subject !== currentCategory) {
                show = false;
            }
            
            // Filter by search
            if (currentSearch && !title.includes(currentSearch) && !author.includes(currentSearch)) {
                show = false;
            }
            
            item.style.display = show ? 'block' : 'none';
        });
        
        updateResultsCount();
    }

    function setupBookActions() {
        // Setup View Details buttons
        const viewDetailsBtns = document.querySelectorAll('.book-overlay .btn-primary');
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bookItem = btn.closest('.book-item');
                const title = bookItem.querySelector('h3').textContent;
                const author = bookItem.querySelector('.author').textContent;
                const isbn = bookItem.querySelector('.isbn').textContent;
                
                // Navigate to book details page with book info
                const bookData = {
                    title: title,
                    author: author,
                    isbn: isbn.replace('ISBN: ', ''),
                    subject: bookItem.querySelector('.subject').textContent
                };
                
                // Store book data in sessionStorage and redirect
                sessionStorage.setItem('selectedBook', JSON.stringify(bookData));
                window.location.href = 'book-details.html';
            });
        });

        // Setup Borrow buttons
        const borrowBtns = document.querySelectorAll('.book-actions .btn-primary');
        borrowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bookItem = btn.closest('.book-item');
                const title = bookItem.querySelector('h3').textContent;
                alert(`Borrow request submitted for "${title}". Please check your email for confirmation.`);
            });
        });

        // Setup Reserve buttons
        const reserveBtns = document.querySelectorAll('.book-actions .btn-outline');
        reserveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bookItem = btn.closest('.book-item');
                const title = bookItem.querySelector('h3').textContent;
                alert(`Reservation request submitted for "${title}". You will be notified when it's available.`);
            });
        });
    }

    // Hook up search input
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    if (searchInput) {
        searchInput.value = currentSearch;
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value.trim().toLowerCase();
                currentPage = 1;
                filterBooks();
            }
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';
            currentPage = 1;
            filterBooks();
        });
    }

    // Subject filter select
    const subjectFilter = document.getElementById('subjectFilter');
    if (subjectFilter) {
        if (currentCategory !== 'all') subjectFilter.value = currentCategory;
        subjectFilter.addEventListener('change', () => {
            currentCategory = subjectFilter.value || 'all';
            currentPage = 1;
            filterBooks();
        });
    }

    // Availability filter
    const availabilityFilter = document.getElementById('availabilityFilter');
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', () => {
            const availability = availabilityFilter.value;
            const bookItems = document.querySelectorAll('.book-item');
            
            bookItems.forEach(item => {
                const status = item.querySelector('.status').textContent.toLowerCase();
                let show = true;
                
                if (availability === 'available' && status !== 'available') {
                    show = false;
                } else if (availability === 'borrowed' && status !== 'borrowed') {
                    show = false;
                } else if (availability === 'reserved' && status !== 'reserved') {
                    show = false;
                }
                
                item.style.display = show ? 'block' : 'none';
            });
            
            updateResultsCount();
        });
    }

    // Sort functionality
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            const sortType = sortBy.value;
            const bookItems = Array.from(document.querySelectorAll('.book-item'));
            const booksContainer = document.getElementById('booksContainer');
            
            bookItems.sort((a, b) => {
                let aValue, bValue;
                
                switch (sortType) {
                    case 'title':
                        aValue = a.querySelector('h3').textContent.toLowerCase();
                        bValue = b.querySelector('h3').textContent.toLowerCase();
                        break;
                    case 'author':
                        aValue = a.querySelector('.author').textContent.toLowerCase();
                        bValue = b.querySelector('.author').textContent.toLowerCase();
                        break;
                    case 'date':
                        // For now, just sort by title since we don't have dates
                        aValue = a.querySelector('h3').textContent.toLowerCase();
                        bValue = b.querySelector('h3').textContent.toLowerCase();
                        break;
                    case 'popularity':
                        // For now, just sort by title since we don't have popularity data
                        aValue = a.querySelector('h3').textContent.toLowerCase();
                        bValue = b.querySelector('h3').textContent.toLowerCase();
                        break;
                    default:
                        aValue = a.querySelector('h3').textContent.toLowerCase();
                        bValue = b.querySelector('h3').textContent.toLowerCase();
                }
                
                return aValue.localeCompare(bValue);
            });
            
            // Re-append sorted items
            bookItems.forEach(item => booksContainer.appendChild(item));
        });
    }

    // View toggle functionality
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            const booksContainer = document.getElementById('booksContainer');
            
            // Remove active class from all buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply view class
            booksContainer.className = `books-container ${view}-view`;
        });
    });

    function updateResultsCount() {
        const el = document.getElementById('resultsCount');
        if (!el) return;
        
        const visibleBooks = document.querySelectorAll('.book-item[style*="display: block"], .book-item:not([style*="display: none"])');
        const total = visibleBooks.length;
        const start = 1;
        const end = Math.min(total, perPage);
        
        el.textContent = `Showing ${start}-${end} of ${total} books`;
    }

    // Initialize results count
    updateResultsCount();
});
