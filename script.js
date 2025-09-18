// ===================
// Cash Register Project
// ===================

// Initial price (you can change this or make it dynamic later)
let price = 19.5;

// Cash drawer setup
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// DOM elements
const priceScreen = document.getElementById("price-screen");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");
const purchaseBtn = document.getElementById("purchase-btn");
const cashInput = document.getElementById("cash");
const changeDue = document.getElementById("change-due");

// Set price screen
priceScreen.textContent = `Total: $${price.toFixed(2)}`;

// Display drawer
function updateDrawer() {
  cashDrawerDisplay.innerHTML = "<strong>Cash Drawer:</strong><br>";
  cid.forEach(item => {
    cashDrawerDisplay.innerHTML += `${item[0]}: $${item[1].toFixed(2)}<br>`;
  });
}
updateDrawer();

// Function to handle change
function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  let totalCid = parseFloat(cid.reduce((sum, curr) => sum + curr[1], 0).toFixed(2));
  let changeArr = [];

  if (change < 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  if (change === 0) {
    return { status: "NO_CHANGE", change: [] };
  }
  if (totalCid < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  if (totalCid === change) {
    return { status: "CLOSED", change: cid };
  }

  const currencyUnit = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
  };

  let reversedCid = [...cid].reverse();

  for (let [unit, amount] of reversedCid) {
    let unitValue = currencyUnit[unit];
    let unitAmount = (amount / unitValue);
    let used = 0;

    while (change >= unitValue && unitAmount > 0) {
      change = parseFloat((change - unitValue).toFixed(2));
      unitAmount--;
      used++;
    }
    if (used > 0) {
      changeArr.push([unit, used * unitValue]);
    }
  }

  if (change > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeArr };
}

// Handle purchase
purchaseBtn.addEventListener("click", () => {
  const cash = parseFloat(cashInput.value);

  if (isNaN(cash) || cash <= 0) {
    changeDue.textContent = "⚠️ Please enter valid cash amount.";
    return;
  }

  const result = checkCashRegister(price, cash, cid);

  if (result.status === "NO_CHANGE") {
    changeDue.textContent = "Exact amount received. No change due.";
  } else if (result.status === "INSUFFICIENT_FUNDS") {
    changeDue.textContent = "INSUFFICIENT FUNDS";
  } else if (result.status === "CLOSED") {
    changeDue.innerHTML = "CLOSED<br>";
    result.change.forEach(item => {
      changeDue.innerHTML += `${item[0]}: $${item[1].toFixed(2)}<br>`;
    });
  } else {
    changeDue.innerHTML = `<strong>Change Due:</strong><br>`;
    result.change.forEach(item => {
      changeDue.innerHTML += `${item[0]}: $${item[1].toFixed(2)}<br>`;
    });
  }
});
