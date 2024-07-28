let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    fetchQuotesFromServer();
    populateCategories();
    showRandomQuote();
  });
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportButton").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerText = quotes[randomIndex].text;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      populateCategories();
      filterQuotes(); // Show filtered quotes after adding a new quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
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
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      quoteDisplay.innerText = filteredQuotes[randomIndex].text;
    } else {
      quoteDisplay.innerText = "No quotes available for this category.";
    }
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
      filterQuotes(); // Update display after importing
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  function fetchQuotesFromServer() {
    // Simulate fetching quotes from a server
    const serverQuotes = [
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" },
    ];
    
    quotes.push(...serverQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes(); // Update display after fetching from server
  }
  
  function createAddQuoteForm() {
    // Assuming this function should handle creating and displaying the form dynamically
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
    addButton.onclick = addQuote;
    formContainer.appendChild(addButton);
    
    document.body.appendChild(formContainer);
  }
  
  // Call the createAddQuoteForm function to create and display the form
  createAddQuoteForm();