import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Star, Plus, Minus, X, BookOpen, Heart, Filter } from 'lucide-react';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const books = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      category: "fiction",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A magical novel about the choices that go into a life well lived."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 27.99,
      category: "self-help",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description: "Transform your life with tiny changes in behavior that deliver remarkable results."
    },
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      price: 19.99,
      category: "sci-fi",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A science fiction masterpiece set on the desert planet Arrakis."
    },
    {
      id: 4,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      price: 22.99,
      category: "business",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300&h=400&fit=crop",
      description: "Timeless lessons on wealth, greed, and happiness."
    },
    {
      id: 5,
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: 26.99,
      category: "sci-fi",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
      description: "A lone astronaut must save humanity in this thrilling space adventure."
    },
    {
      id: 6,
      title: "Educated",
      author: "Tara Westover",
      price: 23.99,
      category: "memoir",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A powerful memoir about education, family, and finding your own voice."
    },
    {
      id: 7,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      price: 21.99,
      category: "fiction",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A reclusive Hollywood icon finally tells her story."
    },
    {
      id: 8,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      price: 25.99,
      category: "psychology",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description: "Explore the two systems that drive the way we think."
    }
  ];

  const categories = ['all', 'fiction', 'sci-fi', 'self-help', 'business', 'memoir', 'psychology'];

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const addToCart = (book) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleFavorite = (bookId) => {
    setFavorites(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  return (
    <div className="bookstore">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <BookOpen className="logo-icon" />
              <h1>BookHaven</h1>
            </div>
            
            <div className="search-container">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="cart-button"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Category Filter */}
        <div className="category-section">
          <div className="category-header">
            <Filter size={20} />
            <span>Categories:</span>
          </div>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Books Grid */}
          <div className="books-section">
            <div className="books-grid">
              {filteredBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-image-container">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="book-image"
                    />
                    <button
                      onClick={() => toggleFavorite(book.id)}
                      className="favorite-btn"
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(book.id) ? 'heart-filled' : 'heart-empty'}
                      />
                    </button>
                  </div>
                  
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    
                    <div className="book-rating">
                      {renderStars(book.rating)}
                      <span className="rating-text">({book.rating})</span>
                    </div>
                    
                    <p className="book-description">{book.description}</p>
                    
                    <div className="book-footer">
                      <span className="book-price">${book.price}</span>
                      <button
                        onClick={() => addToCart(book)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="no-results">
                <BookOpen size={64} />
                <h3>No books found</h3>
                <p>Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="cart-sidebar">
              <div className="cart-header">
                <h2>Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={48} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="cart-item-image"
                        />
                        <div className="cart-item-info">
                          <h4>{item.title}</h4>
                          <p>${item.price}</p>
                        </div>
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total: ${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <BookOpen className="footer-logo-icon" />
                <h3>BookHaven</h3>
              </div>
              <p>Your gateway to endless stories and knowledge.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">New Releases</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Categories</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <p>Stay updated with our latest books and offers!</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;