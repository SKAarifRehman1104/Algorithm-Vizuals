
// DOM Elements
const valueInput = document.getElementById('valueInput');
const indexInput = document.getElementById('indexInput');
const addFrontBtn = document.getElementById('addFrontBtn');
const addEndBtn = document.getElementById('addEndBtn');
const addIndexBtn = document.getElementById('addIndexBtn');
const delFrontBtn = document.getElementById('delFrontBtn');
const delEndBtn = document.getElementById('delEndBtn');
const delIndexBtn = document.getElementById('delIndexBtn');
const searchBtn = document.getElementById('searchBtn');
const linkedListContainer = document.getElementById('linkedListContainer');
const toastContainer = document.getElementById('toastContainer');

// State
class Node {
  constructor(value) {
    this.value = value;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

let nodes = [];
let isAnimating = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initialize with some values
  const initialNodes = [23, 47, 89, 12].map(value => new Node(value));
  nodes = initialNodes;
  renderLinkedList();
  
  // Event listeners
  addFrontBtn.addEventListener('click', handleAddToFront);
  addEndBtn.addEventListener('click', handleAddToEnd);
  addIndexBtn.addEventListener('click', handleAddAtIndex);
  delFrontBtn.addEventListener('click', handleDeleteFromFront);
  delEndBtn.addEventListener('click', handleDeleteFromEnd);
  delIndexBtn.addEventListener('click', handleDeleteAtIndex);
  searchBtn.addEventListener('click', handleSearch);
});

// Helper Functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

function renderLinkedList() {
  linkedListContainer.innerHTML = '';
  
  if (nodes.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'text-muted italic';
    emptyMessage.textContent = 'Linked list is empty';
    linkedListContainer.appendChild(emptyMessage);
    return;
  }
  
  nodes.forEach((node, index) => {
    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'flex items-center';
    nodeContainer.id = `node-${node.id}`;
    
    // Create node element
    const nodeElement = document.createElement('div');
    nodeElement.className = 'glass-card w-40 h-40 p-4 flex items-center justify-center relative transition-all duration-300 rounded-lg shadow-lg';
    nodeElement.setAttribute('data-node-id', node.id);
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'text-2xl font-bold';
    valueDisplay.textContent = node.value;
    
    const indexDisplay = document.createElement('span');
    indexDisplay.className = 'absolute bottom-0 pb-1 text-base font-medium text-muted w-full text-center';
    indexDisplay.textContent = index;
    
    nodeElement.appendChild(valueDisplay);
    nodeElement.appendChild(indexDisplay);
    nodeContainer.appendChild(nodeElement);
    
    // Add arrow if not the last node
    if (index < nodes.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'mx-4 text-muted';
      arrow.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      `;
      nodeContainer.appendChild(arrow);
    }
    
    linkedListContainer.appendChild(nodeContainer);
  });
}

function highlightElement(element, color = '#f97316', duration = 800) {
  if (!element) return null;
  
  const originalBackgroundColor = window.getComputedStyle(element).backgroundColor;
  
  return element.animate([
    { backgroundColor: originalBackgroundColor },
    { backgroundColor: color, offset: 0.5 },
    { backgroundColor: originalBackgroundColor }
  ], {
    duration,
    easing: 'ease-in-out'
  });
}

function getNodeElement(index) {
  if (index < 0 || index >= nodes.length) return null;
  
  const nodeId = nodes[index].id;
  return document.querySelector(`[data-node-id="${nodeId}"]`);
}

// Event Handlers
function handleAddToFront() {
  if (valueInput.value.trim() === "" || isAnimating) return;
  
  const value = parseInt(valueInput.value);
  if (isNaN(value)) {
    showToast("Please enter a valid number", "error");
    return;
  }
  
  const newNode = new Node(value);
  nodes = [newNode, ...nodes];
  valueInput.value = '';
  
  renderLinkedList();
  
  // Animate the new node
  setTimeout(() => {
    const nodeElement = getNodeElement(0);
    if (nodeElement) {
      highlightElement(nodeElement, '#22c55e');
    }
  }, 100);
  
  showToast(`Added ${value} to the front`);
}

function handleAddToEnd() {
  if (valueInput.value.trim() === "" || isAnimating) return;
  
  const value = parseInt(valueInput.value);
  if (isNaN(value)) {
    showToast("Please enter a valid number", "error");
    return;
  }
  
  const newNode = new Node(value);
  nodes = [...nodes, newNode];
  valueInput.value = '';
  
  renderLinkedList();
  
  // Animate the new node
  setTimeout(() => {
    const newIndex = nodes.length - 1;
    const nodeElement = getNodeElement(newIndex);
    if (nodeElement) {
      highlightElement(nodeElement, '#22c55e');
    }
  }, 100);
  
  showToast(`Added ${value} to the end`);
}

async function handleAddAtIndex() {
  if (valueInput.value.trim() === "" || indexInput.value.trim() === "" || isAnimating) return;
  
  const value = parseInt(valueInput.value);
  const index = parseInt(indexInput.value);
  
  if (isNaN(value)) {
    showToast("Please enter a valid number", "error");
    return;
  }
  
  if (isNaN(index) || index < 0 || index > nodes.length) {
    showToast(`Index must be between 0 and ${nodes.length}`, "error");
    return;
  }
  
  isAnimating = true;
  
  // Animate traversal to the insertion point
  for (let i = 0; i < index; i++) {
    const nodeElement = getNodeElement(i);
    if (nodeElement) {
      highlightElement(nodeElement, '#3b82f6');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  const newNode = new Node(value);
  nodes.splice(index, 0, newNode);
  valueInput.value = '';
  indexInput.value = '';
  
  renderLinkedList();
  
  // Highlight the inserted node
  setTimeout(() => {
    const nodeElement = getNodeElement(index);
    if (nodeElement) {
      highlightElement(nodeElement, '#22c55e');
    }
    isAnimating = false;
  }, 300);
  
  showToast(`Inserted ${value} at index ${index}`);
}

function handleDeleteFromFront() {
  if (nodes.length === 0 || isAnimating) return;
  
  isAnimating = true;
  
  // Animate the deletion
  const nodeElement = getNodeElement(0);
  if (nodeElement) {
    highlightElement(nodeElement, '#ef4444');
  }
  
  setTimeout(() => {
    const deletedValue = nodes[0].value;
    nodes = nodes.slice(1);
    renderLinkedList();
    isAnimating = false;
    showToast(`Removed ${deletedValue} from the front`);
  }, 600);
}

function handleDeleteFromEnd() {
  if (nodes.length === 0 || isAnimating) return;
  
  isAnimating = true;
  
  // Animate the deletion
  const lastIndex = nodes.length - 1;
  const nodeElement = getNodeElement(lastIndex);
  if (nodeElement) {
    highlightElement(nodeElement, '#ef4444');
  }
  
  setTimeout(() => {
    const deletedValue = nodes[lastIndex].value;
    nodes = nodes.slice(0, lastIndex);
    renderLinkedList();
    isAnimating = false;
    showToast(`Removed ${deletedValue} from the end`);
  }, 600);
}

async function handleDeleteAtIndex() {
  if (indexInput.value.trim() === "" || isAnimating || nodes.length === 0) return;
  
  const index = parseInt(indexInput.value);
  
  if (isNaN(index) || index < 0 || index >= nodes.length) {
    showToast(`Index must be between 0 and ${nodes.length - 1}`, "error");
    return;
  }
  
  isAnimating = true;
  
  // Animate traversal to the deletion point
  for (let i = 0; i < index; i++) {
    const nodeElement = getNodeElement(i);
    if (nodeElement) {
      highlightElement(nodeElement, '#3b82f6');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Highlight the node to be deleted
  const nodeToDelete = getNodeElement(index);
  if (nodeToDelete) {
    highlightElement(nodeToDelete, '#ef4444');
  }
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const deletedValue = nodes[index].value;
  nodes.splice(index, 1);
  indexInput.value = '';
  renderLinkedList();
  isAnimating = false;
  
  showToast(`Removed ${deletedValue} from index ${index}`);
}

async function handleSearch() {
  if (valueInput.value.trim() === "" || isAnimating || nodes.length === 0) return;
  
  const searchValue = parseInt(valueInput.value);
  if (isNaN(searchValue)) {
    showToast("Please enter a valid number", "error");
    return;
  }
  
  isAnimating = true;
  
  // Simulate linked list traversal with animation
  let foundIndex = -1;
  for (let i = 0; i < nodes.length; i++) {
    const nodeElement = getNodeElement(i);
    if (nodeElement) {
      highlightElement(nodeElement, '#3b82f6');
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (nodes[i].value === searchValue) {
      foundIndex = i;
      const foundElement = getNodeElement(i);
      if (foundElement) {
        highlightElement(foundElement, '#22c55e');
      }
      break;
    }
  }
  
  if (foundIndex !== -1) {
    showToast(`Found ${searchValue} at index ${foundIndex}`);
  } else {
    showToast(`${searchValue} not found in the linked list`, "error");
  }
  
  isAnimating = false;
  valueInput.value = '';
}