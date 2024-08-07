import React, { useEffect } from 'react';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Async thunk for fetching a random quote
export const fetchRandomQuote = createAsyncThunk(
  'quote/fetchRandom',
  async () => {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return { text: data.content, author: data.author };
  }
);

// Redux slice for managing quote state
const quoteSlice = createSlice({
  name: 'quote',
  initialState: {
    text: '',
    author: '',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomQuote.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRandomQuote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.text = action.payload.text;
        state.author = action.payload.author;
      })
      .addCase(fetchRandomQuote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Configure Redux store
const store = configureStore({
  reducer: {
    quote: quoteSlice.reducer,
  },
});

// Main App component
function App() {
  const dispatch = useDispatch();
  const { text, author, status } = useSelector((state) => state.quote);

  // Fetch a random quote on component mount
  useEffect(() => {
    dispatch(fetchRandomQuote());
  }, [dispatch]);

  // Handler for fetching a new quote
  const handleNewQuote = () => {
    dispatch(fetchRandomQuote());
  };

  // Handler for tweeting the current quote
  const tweetQuote = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `"${text}" - ${author}`
    )}`;
    window.open(twitterUrl, '_blank');
  };

  // Show loading state while fetching quote
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Render the quote box
  return (
    <div className="app">
      <div id="quote-box">
        <p id="text">{text}</p>
        <p id="author">{author}</p>
        <button id="new-quote" onClick={handleNewQuote}>
          New Quote
        </button>
        <a
          id="tweet-quote"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `"${text}" - ${author}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={tweetQuote}
        >
          Tweet Quote
        </a>
      </div>
    </div>
  );
}

// Root component to provide Redux store
function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default Root;

// CSS styles
const styles = `
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

#quote-box {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

#text {
  font-size: 24px;
  margin-bottom: 10px;
}

#author {
  font-style: italic;
  margin-bottom: 20px;
}

button, a {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

#new-quote {
  background-color: #4CAF50;
  color: white;
}

#tweet-quote {
  background-color: #1DA1F2;
  color: white;
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
