let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    fetchQuotesFromServer();
    populateCategories();
    showRandomQuote();
    startSyncing();
  });
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportButton").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  
  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quoteDisplay = document.getElementById("quoteDisplay");
      quoteDisplay.innerText = filteredQuotes[randomIndex].text;
    } else {
      quoteDisplay.innerText = "No quotes available for this category.";
    }
  }
  
  async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      filterQuotes();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      try {
        await postQuoteToServer(newQuote);
        alert("Quote added and posted to server successfully.");
      } catch (error) {
        console.error("Error posting quote to server:", error);
        alert("Quote added locally, but failed to post to server.");
      }
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  function filterQuotes() {
    showRandomQuote();
  }
  
  function getFilteredQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    return selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  }
  
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "Server" }));
      quotes.push(...serverQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
    } catch (error) {
      console.error("Error fetching quotes from server:", error);
    }
  }
  
  async function postQuoteToServer(quote) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
  
    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }
  
    const data = await response.json();
    console.log("Quote posted to server:", data);
  }
  
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
  
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    formContainer.appendChild(quoteInput);
  
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    formContainer.appendChild(categoryInput);
  
    const addButton = document.createElement('button');
    addButton.id = 'addQuoteButton';
    addButton.textContent = 'Add Quote';
    formContainer.appendChild(addButton);
  
    document.body.appendChild(formContainer);
  }
  
  createAddQuoteForm();
  
  function startSyncing() {
    setInterval(syncQuotes, 30000); // Sync every 30 seconds
  }
  
  async function syncQuotes() {
    try {
      const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
      // Fetch latest quotes from server
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: "Server" }));
  
      // Merge server quotes into local quotes
      const mergedQuotes = [...localQuotes, ...serverQuotes];
      localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  
      // Update the in-memory quotes array and refresh the UI
      quotes = mergedQuotes;
      populateCategories();
      filterQuotes();
  
      console.log("Quotes synced successfully.");
    } catch (error) {
      console.error("Error syncing quotes:", error);
    }
  }
  