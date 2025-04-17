// Menu toggle
document.getElementById('menuButton').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
  });
  
  // User dropdown toggle
  document.getElementById('userIcon').addEventListener('click', function() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('active');
  });
  
  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', function(event) {
    const userIcon = document.getElementById('userIcon');
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const menu = document.getElementById('menu');
    
    if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
    
    if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.add('hidden');
    }
  });
  
  
  document.addEventListener("DOMContentLoaded", function () {
      // Retrieve the stored username or set a default one
      let username = localStorage.getItem("username");
  
      // Display the username below "User"
      document.getElementById("username").textContent = username;
  
      // Add event listener for Logout
      document.getElementById("logoutBtn").addEventListener("click", function () {
          localStorage.removeItem("username"); // Clear stored username
          window.location.href = "vivosa.html"; // Redirect to login page
      });
  });
  
  
  document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
  
  
  
  // Overlay functions
  function showOverlay(overlayId) {
      document.getElementById(overlayId).classList.remove('hidden');
      // Close the dropdown menu when opening an overlay
      document.getElementById('dropdownMenu').classList.remove('active');
  }
  
  function closeOverlay(overlayId) {
      document.getElementById(overlayId).classList.add('hidden');
  }
  
  
  
  
  
  // Update password function
  function updatePassword() {
    const current = document.querySelector('#changePasswordOverlay input:nth-of-type(1)').value;
    const newPass = document.querySelector('#changePasswordOverlay input:nth-of-type(2)').value;
    const confirm = document.querySelector('#changePasswordOverlay input:nth-of-type(3)').value;
  
    const savedPassword = localStorage.getItem('savedPassword') || 'vivosmed'; // Default if not set
  
    if (current !== savedPassword) {
      alert('Current password is incorrect.');
      return;
    }
  
    if (newPass !== confirm) {
      alert('New passwords do not match.');
      return;
    }
  
    if (newPass.trim() === '') {
      alert('Password cannot be empty.');
      return;
    }
  
    // Save the new password
    localStorage.setItem('savedPassword', newPass);
    alert('Password updated successfully.');
    closeOverlay('changePasswordOverlay');
    
    // Clear inputs
    document.querySelector('#changePasswordOverlay input:nth-of-type(1)').value = '';
    document.querySelector('#changePasswordOverlay input:nth-of-type(2)').value = '';
    document.querySelector('#changePasswordOverlay input:nth-of-type(3)').value = '';
  }
  
  
  
  
  // Calculator functions
  document.getElementById('calculatorBtn').addEventListener('click', function() {
      const calculator = document.getElementById('calculatorOverlay');
      calculator.classList.toggle('show');
  });
  
  function press(value) {
      document.getElementById('calc-display').value += value;
  }
  
  function clearCalc() {
      document.getElementById('calc-display').value = '';
  }
  
  function calculate() {
      try {
          const result = eval(document.getElementById('calc-display').value);
          document.getElementById('calc-display').value = result;
      } catch (error) {
          document.getElementById('calc-display').value = 'Error';
      }
  }
  
  function closeCalculator() {
      document.getElementById('calculatorOverlay').classList.remove('show');
  }
  
  // Make calculator draggable
  const calcHeader = document.getElementById('calculatorHeader');
  const calculator = document.getElementById('calculatorOverlay');
  let isDragging = false;
  let offsetX, offsetY;
  
  calcHeader.addEventListener('mousedown', function(e) {
      isDragging = true;
      const rect = calculator.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
  });
  
  document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      calculator.style.left = `${x}px`;
      calculator.style.top = `${y}px`;
      calculator.style.right = 'auto';
      calculator.style.bottom = 'auto';
  });
  
  document.addEventListener('mouseup', function() {
      isDragging = false;
  });
  
  // POS functions
  let cartItems = [];
  
  function addToReceipt(productName, price) {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.name === productName);
      
      if (existingItemIndex !== -1) {
          // Increment quantity if item exists
          cartItems[existingItemIndex].quantity += 1;
      } else {
          // Add new item to cart
          cartItems.push({
              name: productName,
              price: price,
              quantity: 1
          });
      }
      
      updateReceiptDisplay();
  }
  
  function updateReceiptDisplay() {
      const receiptItemsContainer = document.getElementById('receiptItems');
      receiptItemsContainer.innerHTML = '';
      
      let total = 0;
      
      cartItems.forEach(item => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          
          const itemElement = document.createElement('div');
          itemElement.className = 'receipt-item';
          itemElement.innerHTML = `
              <span class="item-name">${item.name}</span>
              <span class="item-price">₱${item.price.toFixed(2)}</span>
              <span class="item-qty">x${item.quantity}</span>
              <span class="item-total">₱${itemTotal.toFixed(2)}</span>
          `;
          
          receiptItemsContainer.appendChild(itemElement);
      });
      
      document.getElementById('totalAmount').textContent = total.toFixed(2);
      
      // Reset change calculation when cart changes
      document.getElementById('cashGiven').value = '';
      document.getElementById('changeAmount').textContent = '0.00';
      document.getElementById('cashWarning').style.display = 'none';
  }
  
  function calculateChange() {
      const total = parseFloat(document.getElementById('totalAmount').textContent);
      const cashGiven = parseFloat(document.getElementById('cashGiven').value) || 0;
      const change = cashGiven - total;
      
      if (change >= 0) {
          document.getElementById('changeAmount').textContent = change.toFixed(2);
          document.getElementById('cashWarning').style.display = 'none';
      } else {
          document.getElementById('changeAmount').textContent = '0.00';
          document.getElementById('cashWarning').textContent = 'Insufficient cash amount!';
          document.getElementById('cashWarning').style.display = 'block';
      }
  }
  
  function checkoutAndPrint() {
      const total = parseFloat(document.getElementById('totalAmount').textContent);
      const cashGiven = parseFloat(document.getElementById('cashGiven').value) || 0;
      
      if (cartItems.length === 0) {
          alert('Please add items to the cart first.');
          return;
      }
      
      if (cashGiven < total) {
          alert('Please enter sufficient cash amount.');
          return;
      }
      
      // Simulate printing receipt
      alert('Receipt printed successfully!');
      resetReceipt();
  }
  
  function resetReceipt() {
      cartItems = [];
      updateReceiptDisplay();
      document.getElementById('cashGiven').value = '';
  }
  
  // Search functionality
  document.getElementById('searchBar').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const productItems = document.querySelectorAll('.product-tile');
      
      productItems.forEach(item => {
          const productName = item.querySelector('h3').textContent.toLowerCase();
          if (productName.includes(searchTerm)) {
              item.style.display = 'block';
          } else {
              item.style.display = 'none';
          }
      });
  });
  
  
  // overlay reciept 
  function checkoutAndPrint() {
      // Populate values
      document.getElementById("receiptCashier").textContent = "Michelle Vivos";
      document.getElementById("receiptDate").textContent = new Date().toLocaleDateString();
      document.getElementById("receiptTotal").textContent = document.getElementById("totalAmount").textContent;
      document.getElementById("receiptCash").textContent = document.getElementById("cashGiven").value;
      document.getElementById("receiptChange").textContent = document.getElementById("changeAmount").textContent;
    
      // Populate products
      const receiptItems = document.getElementById("receiptItems").innerHTML;
      document.getElementById("receiptProductList").innerHTML = receiptItems;
    
      // Show overlay
      document.getElementById("receiptOverlay").classList.remove("hidden");
    }
    function closeReceiptOverlay() {
      document.getElementById("receiptOverlay").classList.add("hidden");
    }


//inventory delete button
    function deleteItem(itemId) {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`/delete_item/${itemId}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        fetch('/api/inventory')
          .then(response => response.json())
          .then(data => {
            const productList = document.getElementById("productList");
      
            data.forEach(item => {
              const tile = document.createElement("div");
              tile.className = "product-tile";
              tile.onclick = () => {
                // Call addToReceipt
                addToReceipt(item.name, item.shop_price);
              
                // Call backend to decrease quantity
                fetch(`/decrease_quantity/${item.id}`, {
                  method: 'POST',
                })
                .then(response => response.json())
                .then(result => {
                  if (result.status === 'success') {
                    // Decrease quantity visually on the tile
                    let qtyText = tile.querySelector(".product-qty");
                    let currentQty = parseInt(qtyText.textContent.replace("Stock: ", ""));
                    if (currentQty > 0) {
                      qtyText.textContent = `Stock: ${currentQty - 1}`;
                    }
                  } else {
                    alert(result.message || 'Failed to update quantity.');
                  }
                })
                .catch(err => {
                  console.error("Error updating quantity:", err);
                });
              };
              
      
              tile.innerHTML = `
                <h3>${item.name}</h3>
                <p class="price">₱${item.shop_price}</p>
                <p class="product-qty" style="font-size: 12px; color: gray;">Stock: ${item.quantity}</p>
                `;

      
              productList.appendChild(tile);
            });
          })
          .catch(err => {
            console.error("Failed to load inventory:", err);
          });
      });