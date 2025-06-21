// DOM Elements
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close-btn');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const userActionsContainer = document.querySelector('.user-actions');

// Sample user accounts
const users = [
    {
        username: 'Natthz',
        password: 'Andi naruto',
        email: 'Natthz@email.com',
        profilePic: null // No profile pic initially
    }
];

// Current logged in user
let currentUser = null;

// Check if user is already logged in from localStorage
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIAfterLogin();
    }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkLoggedInUser();
    
    // Login button click
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    // Signup button click
    signupButton.addEventListener('click', () => {
        signupModal.style.display = 'flex';
    });

    // Close modal buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Show signup link
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });

    // Show login link
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);

    // Signup form submission
    signupForm.addEventListener('submit', handleSignup);

    // Click outside to close modals
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        // Login successful
        currentUser = user;
        
        // Save user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIAfterLogin();
        
        // Close modal
        loginModal.style.display = 'none';
        
        // Reset form
        loginForm.reset();
        
        showNotification('Login successful!', 'success');
    } else {
        // Login failed
        showNotification('Invalid username or password!', 'error');
    }
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        showNotification('Username already exists!', 'error');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        email,
        password,
        profilePic: null
    };
    
    // Add to users array
    users.push(newUser);
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateUIAfterLogin();
    
    // Close modal
    signupModal.style.display = 'none';
    
    // Reset form
    signupForm.reset();
    
    showNotification('Account created successfully!', 'success');
}

// Update UI after login
function updateUIAfterLogin() {
    // Remove login and signup buttons
    userActionsContainer.innerHTML = '';
    
    // Create profile picture element
    const profileElement = document.createElement('div');
    profileElement.className = 'user-profile';
    
    if (currentUser.profilePic) {
        // If user has a profile picture
        profileElement.innerHTML = `<img src="${currentUser.profilePic}" alt="${currentUser.username}" class="profile-pic">`;
    } else {
        // If no profile picture, show circle with first letter of username
        profileElement.innerHTML = `
            <div class="profile-circle">
                ${currentUser.username.charAt(0).toUpperCase()}
            </div>
        `;
    }
    
    // Add dropdown menu - modified to match the screenshot structure
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'profile-dropdown';
    dropdownMenu.innerHTML = `
        <ul>
            <li><a href="#profile"><i class="fas fa-user"></i> Profile</a></li>
            <li><a href="#settings"><i class="fas fa-cog"></i> Settings</a></li>
            <li><a href="#mylist"><i class="fas fa-list"></i> My List</a></li>
            <li><a href="#logout" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    `;
    
    // Append elements
    profileElement.appendChild(dropdownMenu);
    userActionsContainer.appendChild(profileElement);
    
    // Add event listener for profile click to show/hide dropdown
    profileElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    // Add event listener for logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        logout();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileElement.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Add keybinding for ESC to close dropdown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Logout function
function logout() {
    // Clear current user
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Restore original buttons
    userActionsContainer.innerHTML = `
        <button class="btn login-btn" id="loginButton">Login</button>
        <button class="btn signup-btn" id="signupButton">Sign Up</button>
    `;
    
    // Re-add event listeners
    document.getElementById('loginButton').addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    document.getElementById('signupButton').addEventListener('click', () => {
        signupModal.style.display = 'flex';
    });
    
    showNotification('Logged out successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for profile picture and notifications
const styleElement = document.createElement('style');
styleElement.textContent = `
    .user-profile {
        position: relative;
        cursor: pointer;
    }
    
    .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--primary-color);
    }
    
    .profile-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
    }
    
    .profile-dropdown {
        position: absolute;
        top: 50px;
        right: 0;
        background-color: var(--card-background);
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        width: 180px;
        display: none;
        z-index: 1000;
        border: 1px solid var(--border-color);
    }
    
    .profile-dropdown.show {
        display: block;
    }
    
    .profile-dropdown ul {
        list-style: none;
        padding: 0;
    }
    
    .profile-dropdown ul li {
        padding: 0;
        margin: 0;
    }
    
    .profile-dropdown ul li a {
        display: block;
        padding: 10px 15px;
        color: var(--text-primary);
        transition: background-color 0.3s;
    }
    
    .profile-dropdown ul li a:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .profile-dropdown ul li a i {
        margin-right: 10px;
        width: 20px;
        text-align: center;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background-color: var(--success-color);
    }
    
    .notification.error {
        background-color: var(--danger-color);
    }
    
    .notification.warning {
        background-color: var(--warning-color);
        color: #333;
    }
`;

// Append style to head
document.head.appendChild(styleElement);

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    
    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            // Add code to switch language
            const isJapanese = this.classList.contains('active');
            console.log('Language set to: ' + (isJapanese ? 'Japanese' : 'English'));
            // Implement language switch functionality
        });
    }
    
    // Dark/Light mode toggle
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Toggle icon between sun and moon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-sun')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            
            // Save preference to localStorage
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
        
        // Check for saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const icon = modeToggle.querySelector('i');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.anime-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // View more buttons functionality
    const viewMoreButtons = document.querySelectorAll('.view-more-button button');
    
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentSection = this.closest('.tab-content');
            const sectionType = parentSection.id;
            
            // Toggle button text and icon
            const buttonIcon = this.querySelector('i');
            
            if (buttonIcon.classList.contains('fa-chevron-down')) {
                this.innerHTML = `View Less <i class="fas fa-chevron-up"></i>`;
                loadMoreContent(sectionType);
            } else {
                this.innerHTML = `View All ${getSectionName(sectionType)} <i class="fas fa-chevron-down"></i>`;
                hideExtraContent(sectionType);
            }
        });
    });
    
    // Helper function to get section name
    function getSectionName(sectionType) {
        switch(sectionType) {
            case 'anime-episodes':
                return 'Episodes';
            case 'anime-characters':
                return 'Characters';
            case 'anime-reviews':
                return 'Reviews';
            default:
                return 'Items';
        }
    }
    
    // Function to simulate loading more content
    function loadMoreContent(sectionType) {
        console.log(`Loading more content for: ${sectionType}`);
        
        // Based on section type, we can load different content
        if (sectionType === 'anime-episodes') {
            const episodesList = document.querySelector(`#${sectionType} .episodes-list`);
            const viewMoreButton = document.querySelector(`#${sectionType} .view-more-button`);
            
            // Add more episodes (6-12)
            for (let i = 6; i <= 12; i++) {
                const episodeItem = document.createElement('div');
                episodeItem.className = 'episode-item extra-item';
                episodeItem.innerHTML = `
                    <div class="episode-number">Episode ${i}</div>
                    <div class="episode-details">
                        <h4>Episode Title ${i}</h4>
                        <div class="episode-info">
                            <span><i class="far fa-clock"></i> 23 min</span>
                            <span><i class="far fa-calendar-alt"></i> ${getFormattedDate(i)}</span>
                        </div>
                        <p class="episode-description">This is a placeholder description for episode ${i}. As Amane and Mahiru's relationship develops, new challenges and sweet moments arise.</p>
                    </div>
                `;
                
                episodesList.insertBefore(episodeItem, viewMoreButton);
            }
        } else if (sectionType === 'anime-characters') {
            const charactersGrid = document.querySelector(`#${sectionType} .characters-grid`);
            const viewMoreButton = document.querySelector(`#${sectionType} .view-more-button`);
            
            // Additional character names
            const extraCharacters = [
                {name: 'Yuuta Fujimiya', jpName: '藤宮 悠太', role: 'Supporting Character', desc: 'Amane\'s father who occasionally visits. He\'s supportive of his son\'s independence.'},
                {name: 'Shino Fujimiya', jpName: '藤宮 詩乃', role: 'Supporting Character', desc: 'Amane\'s mother who loves teasing her son, especially about his relationship with Mahiru.'},
                {name: 'Katsumi Shiina', jpName: '椎名 勝美', role: 'Supporting Character', desc: 'Mahiru\'s strict father who has high expectations for his daughter.'},
                {name: 'Sayaka Shiina', jpName: '椎名 紗耶香', role: 'Supporting Character', desc: 'Mahiru\'s mother who is often absent due to work commitments.'}
            ];
            
            // Add more characters
            extraCharacters.forEach((char, index) => {
                const charCard = document.createElement('div');
                charCard.className = 'character-card extra-item';
                charCard.innerHTML = `
                    <div class="character-card-image">
                        <img src="icons/character${index + 5}.jpg" alt="${char.name}">
                    </div>
                    <div class="character-card-info">
                        <h4>${char.name}</h4>
                        <p class="character-jp-name">${char.jpName}</p>
                        <p class="character-role">${char.role}</p>
                        <p class="character-desc">${char.desc}</p>
                    </div>
                `;
                
                charactersGrid.appendChild(charCard);
            });
        } else if (sectionType === 'anime-reviews') {
            const reviewsContainer = document.querySelector(`#${sectionType} .reviews-container`);
            const viewMoreButton = document.querySelector(`#${sectionType} .view-more-button`);
            const writeReview = document.querySelector(`#${sectionType} .write-review`);
            
            // Additional reviews
            const extraReviews = [
                {user: 'AnimeScholar', date: 'March 5, 2023', rating: 7.8, content: 'While "The Angel Next Door Spoils Me Rotten" doesn\'t break any new ground in the romance genre, it executes its premise nearly flawlessly. The relationship development feels natural and the characters have genuine chemistry. However, it sometimes relies too heavily on genre tropes, which might feel repetitive for seasoned anime viewers.'},
                {user: 'SliceOfLifeFan', date: 'February 28, 2023', rating: 9.5, content: 'This is easily one of the best romance anime I\'ve seen in years! The slow-burn relationship between Amane and Mahiru is incredibly satisfying to watch, and the show takes its time to develop their bond in a realistic way. The animation is gorgeous and the voice acting is top-notch. Can\'t wait for a second season!'},
                {user: 'CriticalViewer', date: 'March 15, 2023', rating: 6.5, content: 'A decent show that suffers from pacing issues in the middle episodes. While the main characters are well-developed, the supporting cast feels somewhat two-dimensional. The animation quality is inconsistent, with some beautiful scenes mixed with more standard fare. It\'s enjoyable but doesn\'t quite live up to the hype.'}
            ];
            
            // Add more reviews
            extraReviews.forEach((review, index) => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card extra-item';
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="icons/user${index + 3}.jpg" alt="User">
                            <div class="reviewer-details">
                                <h4>${review.user}</h4>
                                <span class="review-date">${review.date}</span>
                            </div>
                        </div>
                        <div class="review-rating">
                            <span>${review.rating}</span>
                            <div class="rating-stars">
                                ${generateStars(review.rating)}
                            </div>
                        </div>
                    </div>
                    <div class="review-content">
                        <p>${review.content}</p>
                    </div>
                    <div class="review-footer">
                        <div class="review-helpful">
                            <button><i class="fas fa-thumbs-up"></i> Helpful (${Math.floor(Math.random() * 30) + 5})</button>
                        </div>
                    </div>
                `;
                
                reviewsContainer.insertBefore(reviewCard, viewMoreButton);
            });
        }
    }
    
    // Function to hide extra content
    function hideExtraContent(sectionType) {
        const extraItems = document.querySelectorAll(`#${sectionType} .extra-item`);
        extraItems.forEach(item => {
            item.remove();
        });
    }
    
    // Helper function to generate formatted date for episodes
    function getFormattedDate(episodeNumber) {
        // Starting from Jan 7, 2023 (episode 1)
        const baseDate = new Date(2023, 0, 7); // Jan 7, 2023
        const episodeDate = new Date(baseDate);
        episodeDate.setDate(baseDate.getDate() + (episodeNumber - 1) * 7); // Weekly episodes
        
        return episodeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Helper function to generate star ratings
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Add Write Review functionality
    const writeReviewBtn = document.querySelector('.write-review button');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function() {
            // Create review form modal
            const modal = document.createElement('div');
            modal.className = 'review-modal';
            modal.innerHTML = `
                <div class="review-modal-content">
                    <div class="modal-header">
                        <h3>Write a Review</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="rating-selection">
                            <p>Your Rating:</p>
                            <div class="star-rating">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                                <span class="rating-value">0.0</span>
                            </div>
                        </div>
                        <div class="review-form">
                            <textarea placeholder="Share your thoughts about this anime..."></textarea>
                            <button class="submit-review">Submit Review</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
            
            // Star rating functionality
            const stars = modal.querySelectorAll('.star-rating i');
            const ratingValue = modal.querySelector('.rating-value');
            let currentRating = 0;
            
            stars.forEach(star => {
                // Hover effect
                star.addEventListener('mouseover', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    highlightStars(rating);
                });
                
                // Click to set rating
                star.addEventListener('click', function() {
                    currentRating = parseInt(this.getAttribute('data-rating')) * 2;
                    ratingValue.textContent = currentRating.toFixed(1);
                });
            });
            
            // Reset stars when not hovering
            const starContainer = modal.querySelector('.star-rating');
            starContainer.addEventListener('mouseout', function() {
                if (currentRating > 0) {
                    highlightStars(currentRating / 2);
                } else {
                    stars.forEach(s => {
                        s.className = 'far fa-star';
                    });
                }
            });
            
            // Helper function to highlight stars
            function highlightStars(rating) {
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.className = 'fas fa-star';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
            }
            
            // Submit review
            const submitBtn = modal.querySelector('.submit-review');
            submitBtn.addEventListener('click', function() {
                const reviewText = modal.querySelector('textarea').value.trim();
                
                if (currentRating === 0) {
                    alert('Please select a rating.');
                    return;
                }
                
                if (reviewText === '') {
                    alert('Please write your review.');
                    return;
                }
                
                // Add new review to the top
                addNewReview(currentRating, reviewText);
                modal.remove();
            });
        });
    }
    
    // Function to add new review
    function addNewReview(rating, reviewText) {
        const reviewsContainer = document.querySelector('#anime-reviews .reviews-container');
        const firstReview = reviewsContainer.querySelector('.review-card');
        
        // Create new review element
        const newReview = document.createElement('div');
        newReview.className = 'review-card user-review';
        newReview.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="icons/iconshiina1.jpg" alt="Your Profile">
                    <div class="reviewer-details">
                        <h4>AnimeUser</h4>
                        <span class="review-date">Today</span>
                    </div>
                </div>
                <div class="review-rating">
                    <span>${rating.toFixed(1)}</span>
                    <div class="rating-stars">
                        ${generateStars(rating)}
                    </div>
                </div>
            </div>
            <div class="review-content">
                <p>${reviewText}</p>
            </div>
            <div class="review-footer">
                <div class="review-helpful">
                    <button><i class="fas fa-thumbs-up"></i> Helpful (0)</button>
                </div>
                <div class="review-actions">
                    <button class="edit-review"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-review"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
        
        // Add event listeners for the new review's buttons
        const editBtn = newReview.querySelector('.edit-review');
        const deleteBtn = newReview.querySelector('.delete-review');
        
        editBtn.addEventListener('click', function() {
            // Show edit modal with current review text
            const reviewContent = newReview.querySelector('.review-content p').textContent;
            showEditModal(newReview, rating, reviewContent);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your review?')) {
                newReview.remove();
            }
        });
        
        // Insert at the top of the list, before first review
        reviewsContainer.insertBefore(newReview, firstReview);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'review-success-message';
        successMessage.textContent = 'Your review has been posted!';
        document.body.appendChild(successMessage);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
    
    // Function to show edit modal
    function showEditModal(reviewElement, currentRating, reviewText) {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.innerHTML = `
            <div class="review-modal-content">
                <div class="modal-header">
                    <h3>Edit Your Review</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="rating-selection">
                        <p>Your Rating:</p>
                        <div class="star-rating">
                            <i class="${currentRating >= 2 ? 'fas' : 'far'} fa-star" data-rating="1"></i>
                            <i class="${currentRating >= 4 ? 'fas' : 'far'} fa-star" data-rating="2"></i>
                            <i class="${currentRating >= 6 ? 'fas' : 'far'} fa-star" data-rating="3"></i>
                            <i class="${currentRating >= 8 ? 'fas' : 'far'} fa-star" data-rating="4"></i>
                            <i class="${currentRating >= 10 ? 'fas' : 'far'} fa-star" data-rating="5"></i>
                            <span class="rating-value">${currentRating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div class="review-form">
                        <textarea>${reviewText}</textarea>
                        <button class="submit-review">Update Review</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        // Star rating functionality
        const stars = modal.querySelectorAll('.star-rating i');
        const ratingValue = modal.querySelector('.rating-value');
        let updatedRating = currentRating;
        
        stars.forEach(star => {
            // Hover effect
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            // Click to set rating
            star.addEventListener('click', function() {
                updatedRating = parseInt(this.getAttribute('data-rating')) * 2;
                ratingValue.textContent = updatedRating.toFixed(1);
            });
        });
        
        // Reset stars when not hovering
        const starContainer = modal.querySelector('.star-rating');
        starContainer.addEventListener('mouseout', function() {
            highlightStars(updatedRating / 2);
        });
        
        // Helper function to highlight stars
        function highlightStars(rating) {
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                if (starRating <= rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        }
        
        // Submit updated review
        const submitBtn = modal.querySelector('.submit-review');
        submitBtn.addEventListener('click', function() {
            const updatedText = modal.querySelector('textarea').value.trim();
            
            if (updatedRating === 0) {
                alert('Please select a rating.');
                return;
            }
            
            if (updatedText === '') {
                alert('Please write your review.');
                return;
            }
            
            // Update review content and rating
            reviewElement.querySelector('.review-content p').textContent = updatedText;
            reviewElement.querySelector('.review-rating span').textContent = updatedRating.toFixed(1);
            reviewElement.querySelector('.rating-stars').innerHTML = generateStars(updatedRating);
            
            modal.remove();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'review-success-message';
            successMessage.textContent = 'Your review has been updated!';
            document.body.appendChild(successMessage);
            
            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                // Redirect to login page or perform logout action
                console.log('User logged out');
                // window.location.href = 'login.html';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatTrigger = document.getElementById('chatTrigger');
    const chatContainer = document.getElementById('chatContainer');
    const minimizeChat = document.getElementById('minimizeChat');
    const closeChat = document.getElementById('closeChat');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle chat visibility
    chatTrigger.addEventListener('click', function() {
        chatContainer.classList.add('active');
        chatTrigger.style.display = 'none';
        messageInput.focus();
    });
    
    // Minimize chat
    minimizeChat.addEventListener('click', function() {
        chatContainer.classList.remove('active');
        chatTrigger.style.display = 'flex';
    });
    
    // Close chat
    closeChat.addEventListener('click', function() {
        chatContainer.classList.remove('active');
        chatTrigger.style.display = 'flex';
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button based on input
        if (this.value.trim().length > 0) {
            sendMessage.disabled = false;
        } else {
            sendMessage.disabled = true;
        }
    });
    
    // Send message on Enter key (without Shift)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim().length > 0) {
                sendUserMessage();
            }
        }
    });
    
    // Send message on button click
    sendMessage.addEventListener('click', function() {
        if (messageInput.value.trim().length > 0) {
            sendUserMessage();
        }
    });
    
    // Function to send user message
    function sendUserMessage() {
        const messageText = messageInput.value.trim();
        
        // Create and append user message
        appendMessage('user', messageText);
        
        // Clear input and reset height
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendMessage.disabled = true;
        
        // Simulate AI thinking with typing indicator
        showTypingIndicator();
        
        // Simulate AI response (in real app, this would be an API call)
        setTimeout(() => {
            respondToMessage(messageText);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
        
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        // Add some styling for the typing dots
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 4px 0;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--text-light);
                display: inline-block;
                animation: typingAnimation 1.4s infinite ease-in-out both;
            }
            
            .typing-dots span:nth-child(1) {
                animation-delay: 0s;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typingAnimation {
                0%, 80%, 100% { transform: scale(0.7); opacity: 0.6; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        return typingIndicator;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to respond to user message
    async function respondToMessage(userMessage) {
        removeTypingIndicator();
    
        // Cek apakah user online
        if (navigator.onLine) {
            try {
                const aiResponse = await callGeminiAPI(userMessage);
                appendMessage('bot', aiResponse);
            } catch (error) {
                appendMessage('bot', 'Maaf, gagal menghubungi AI. Menggunakan mode offline.');
                respondToMessageLocal(userMessage); // fallback ke offline
            }
        } else {
            // Offline mode
            respondToMessageLocal(userMessage);
        }
    }

    async function callGeminiAPI(promptText) {
        const apiKey = "YOUR_API_KEY"; // ganti API key
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });
    
        const data = await response.json();
    
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Ehehe~ Maaf ya, Ai-chan lagi istirahat dulu nih (｡•́︿•̀｡) Tapi jangan khawatir! Ai-chan bakal balik lagi dan siap bantu kamu cari anime favorit~! 💫";
        }
    }

    function respondToMessageLocal(userMessage) {
        let aiResponse = '';
        const lowerCaseMessage = userMessage.toLowerCase();
    
        if (lowerCaseMessage.includes('halo') || lowerCaseMessage.includes('hai') || lowerCaseMessage.includes('hi')) {
            aiResponse = 'Hai! Ada yang bisa saya bantu terkait Frontend Development?';
        } else if (lowerCaseMessage.includes('css') || lowerCaseMessage.includes('stylesheet')) {
            aiResponse = 'CSS digunakan untuk desain halaman web. Ada yang ingin Anda tanyakan tentang CSS?';
        } else if (lowerCaseMessage.includes('javascript') || lowerCaseMessage.includes('js')) {
            aiResponse = 'JavaScript adalah bahasa untuk interaksi dinamis. Ingin belajar konsep atau fungsi tertentu?';
        } else if (lowerCaseMessage.includes('html')) {
            aiResponse = 'HTML adalah struktur dasar web. Anda ingin tahu tentang elemen atau struktur tertentu?';
        } else if (lowerCaseMessage.includes('react') || lowerCaseMessage.includes('vue') || lowerCaseMessage.includes('angular')) {
            aiResponse = 'Itu framework JavaScript populer. Mau belajar salah satu di antaranya?';
        } else if (lowerCaseMessage.includes('terima kasih') || lowerCaseMessage.includes('makasih')) {
            aiResponse = 'Sama-sama! Senang bisa membantu.';
        } else {
            aiResponse = 'Saya bisa bantu tentang HTML, CSS, JavaScript, dan framework-nya. Mau mulai dari mana?';
        }
    
        appendMessage('bot', aiResponse);
    }

    window.addEventListener('online', () => {
        appendMessage('bot', 'Anda sekarang online. AI Assistant aktif.');
    });
    
    window.addEventListener('offline', () => {
        appendMessage('bot', 'Anda sedang offline. Menggunakan mode chatbot lokal.');
    });
    
    // Function to append message to chat
    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const currentTime = new Date();
        const timeString = currentTime.getHours().toString().padStart(2, '0') + ':' + 
                          currentTime.getMinutes().toString().padStart(2, '0');
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${sender === 'user' ? 'Anda' : 'AI Assistant'}</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Disable send button initially
    sendMessage.disabled = true;
});

// popular character & spotlight character
 document.addEventListener('DOMContentLoaded', function() {
        // Characters pagination
        const showMoreBtn = document.getElementById('show-more');
        const blocks = document.querySelectorAll('.character-block');
        const pageIndicators = document.querySelectorAll('.pagination .page');
        let currentPage = 1;
        
        function showPage(pageNum) {
            blocks.forEach(block => block.style.display = 'none');
            document.getElementById(`character-block-${pageNum}`).style.display = 'block';
            
            // Update active state on pagination
            pageIndicators.forEach(page => page.classList.remove('active'));
            document.querySelector(`.page[data-page="${pageNum}"]`).classList.add('active');
            
            // Update button text
            showMoreBtn.textContent = (pageNum === blocks.length) ? 'Show Less' : 'Show More';
            currentPage = pageNum;
        }
        
        showMoreBtn.addEventListener('click', function() {
            const nextPage = (currentPage === blocks.length) ? 1 : currentPage + 1;
            showPage(nextPage);
        });
        
        // Add click events to pagination indicators
        pageIndicators.forEach(page => {
            page.addEventListener('click', function() {
                showPage(parseInt(this.getAttribute('data-page')));
            });
        });
    });