
// DOM Elements
const arraySizeInput = document.getElementById('arraySizeInput');
const arrayElementsInput = document.getElementById('arrayElementsInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const generateBtn = document.getElementById('generateBtn');
const applyBtn = document.getElementById('applyBtn');
const startSortingBtn = document.getElementById('startSortingBtn');
const arrayContainer = document.getElementById('arrayContainer');
const algorithmDescription = document.getElementById('algorithmDescription');
const toastContainer = document.getElementById('toastContainer');

// State
let array = [];
let isAnimating = false;
let arrayBars = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  generateRandomArray();
  updateAlgorithmDescription();
  
  // Event listeners
  generateBtn.addEventListener('click', generateRandomArray);
  applyBtn.addEventListener('click', applyCustomArray);
  startSortingBtn.addEventListener('click', startSorting);
  algorithmSelect.addEventListener('change', updateAlgorithmDescription);
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

function generateRandomArray() {
  if (isAnimating) return;
  
  let size = 5; // Default size
  
  // Parse the user input size
  const userSize = parseInt(arraySizeInput.value);
  if (!isNaN(userSize) && userSize > 1) {
    // Limit the size to a reasonable range (2-15)
    size = Math.min(Math.max(userSize, 2), 15);
  } else {
    // If input is invalid, reset to default
    arraySizeInput.value = "5";
    showToast("Using default size of 5. Please enter a number between 2 and 15.", "warning");
  }
  
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
  arrayElementsInput.value = array.join(', ');
  renderArray();
}

function applyCustomArray() {
  if (isAnimating) return;
  
  if (arrayElementsInput.value.trim() === "") {
    showToast("Please enter values for the array", "error");
    return;
  }

  try {
    const parsed = arrayElementsInput.value
      .split(",")
      .map(item => {
        const num = parseInt(item.trim());
        if (isNaN(num)) throw new Error("Invalid number");
        return num;
      })
      .filter(num => !isNaN(num));

    if (parsed.length < 2) {
      showToast("Please enter at least 2 numbers", "error");
      return;
    }

    if (parsed.length > 15) {
      showToast("Please enter at most 15 numbers for better visualization", "error");
      return;
    }

    array = parsed;
    renderArray();
  } catch (error) {
    showToast("Invalid input. Please enter numbers separated by commas", "error");
  }
}

function renderArray() {
  // Clear previous bars
  arrayContainer.innerHTML = '';
  arrayBars = [];
  
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...array);
  
  // Create bars for each array element
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar glass-card flex-col justify-end items-center transition-all duration-300 relative';
    
    const barHeight = Math.max(30, (value / maxValue) * 220);
    const barWidth = Math.max(30, Math.min(60, 600 / array.length));
    
    bar.style.height = `${barHeight}px`;
    bar.style.width = `${barWidth}px`;
    bar.style.transform = 'perspective(800px) rotateX(10deg)';
    bar.style.transformStyle = 'preserve-3d';
    bar.style.boxShadow = '0 10px 15px -5px rgba(0, 0, 0, 0.5)';
    
    // Value label
    const valueLabel = document.createElement('span');
    valueLabel.className = 'text-xs font-medium absolute';
    valueLabel.style.bottom = '2px';
    valueLabel.style.left = '0';
    valueLabel.style.right = '0';
    valueLabel.style.textAlign = 'center';
    valueLabel.style.textShadow = '0px 0px 2px rgba(0,0,0,0.8)';
    valueLabel.textContent = value;
    
    // 3D reflection effect
    const reflection = document.createElement('div');
    reflection.className = 'absolute inset-0 bg-gradient-to-b from-white/10 to-transparent';
    reflection.style.opacity = '0.2';
    
    bar.appendChild(valueLabel);
    bar.appendChild(reflection);
    arrayContainer.appendChild(bar);
    arrayBars.push(bar);
  });
}

function updateAlgorithmDescription() {
  const algorithm = algorithmSelect.value;
  let description = '';
  
  switch (algorithm) {
    case 'bubble':
      description = `
        <p class="mb-2"><span class="font-medium">Bubble Sort</span> works by repeatedly swapping adjacent elements if they are in the wrong order.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Time Complexity: O(n²)</li>
          <li>Space Complexity: O(1)</li>
          <li>Best Case: O(n) when array is already sorted</li>
        </ul>
      `;
      break;
    case 'selection':
      description = `
        <p class="mb-2"><span class="font-medium">Selection Sort</span> works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Time Complexity: O(n²)</li>
          <li>Space Complexity: O(1)</li>
          <li>Best Case: O(n²) even if array is sorted</li>
        </ul>
      `;
      break;
    case 'insertion':
      description = `
        <p class="mb-2"><span class="font-medium">Insertion Sort</span> builds the sorted array one item at a time by comparing each with the items before it.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Time Complexity: O(n²)</li>
          <li>Space Complexity: O(1)</li>
          <li>Best Case: O(n) when array is already sorted</li>
        </ul>
      `;
      break;
    case 'quick':
      description = `
        <p class="mb-2"><span class="font-medium">Quick Sort</span> works by selecting a 'pivot' element and partitioning the array around the pivot.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Time Complexity: O(n log n) average, O(n²) worst case</li>
          <li>Space Complexity: O(log n)</li>
          <li>Divide and conquer algorithm</li>
        </ul>
      `;
      break;
    case 'merge':
      description = `
        <p class="mb-2"><span class="font-medium">Merge Sort</span> works by dividing the array into two halves, sorting them, and then merging the sorted halves.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Time Complexity: O(n log n) in all cases</li>
          <li>Space Complexity: O(n)</li>
          <li>Stable sorting algorithm</li>
        </ul>
      `;
      break;
  }
  
  algorithmDescription.innerHTML = description;
}

// Animation Functions
function highlightElement(element, color = '#f97316', duration = 800) {
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

// Sorting Algorithms
async function startSorting() {
  if (isAnimating) return;
  
  const algorithm = algorithmSelect.value;
  
  isAnimating = true;
  startSortingBtn.textContent = 'Sorting...';
  startSortingBtn.disabled = true;
  generateBtn.disabled = true;
  applyBtn.disabled = true;
  
  try {
    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      case 'quick':
        await quickSort(0, array.length - 1);
        break;
      case 'merge':
        await mergeSort(0, array.length - 1);
        break;
    }
    
    // Highlight the sorted array
    for (let i = 0; i < array.length; i++) {
      highlightElement(arrayBars[i], '#22c55e', 300);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    showToast("Sorting complete!");
  } catch (error) {
    showToast("Error during sorting visualization", "error");
    console.error(error);
  } finally {
    isAnimating = false;
    startSortingBtn.textContent = 'Start Sorting';
    startSortingBtn.disabled = false;
    generateBtn.disabled = false;
    applyBtn.disabled = false;
  }
}

async function bubbleSort() {
  let swapped;
  
  for (let i = 0; i < array.length; i++) {
    swapped = false;
    
    for (let j = 0; j < array.length - i - 1; j++) {
      // Highlight current elements being compared
      highlightElement(arrayBars[j], '#3b82f6', 500);
      highlightElement(arrayBars[j + 1], '#3b82f6', 500);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        
        // Update the UI
        updateArrayDisplay();
        
        // Animate the swap
        highlightElement(arrayBars[j], '#22c55e', 500);
        highlightElement(arrayBars[j + 1], '#ef4444', 500);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    if (!swapped) break;
  }
  
  return array;
}

async function selectionSort() {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    
    // Highlight current minimum
    highlightElement(arrayBars[minIndex], '#3b82f6', 500);
    
    for (let j = i + 1; j < array.length; j++) {
      // Highlight element being compared
      highlightElement(arrayBars[j], '#f97316', 300);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (array[j] < array[minIndex]) {
        // Reset old minimum
        if (minIndex !== i) {
          highlightElement(arrayBars[minIndex], 'transparent', 300);
        }
        
        minIndex = j;
        
        // Highlight new minimum
        highlightElement(arrayBars[minIndex], '#3b82f6', 300);
      } else if (j !== minIndex) {
        // Reset compared element
        highlightElement(arrayBars[j], 'transparent', 300);
      }
    }
    
    if (minIndex !== i) {
      // Swap elements
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      
      // Update the UI
      updateArrayDisplay();
      
      // Animate the swap
      highlightElement(arrayBars[i], '#22c55e', 500);
      highlightElement(arrayBars[minIndex], '#ef4444', 500);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return array;
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let j = i - 1;
    
    // Highlight current element
    highlightElement(arrayBars[i], '#3b82f6', 500);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    while (j >= 0 && array[j] > current) {
      // Highlight element being compared
      highlightElement(arrayBars[j], '#f97316', 300);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      array[j + 1] = array[j];
      j--;
      
      // Update the UI
      updateArrayDisplay();
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    array[j + 1] = current;
    
    // Update the UI
    updateArrayDisplay();
    
    // Highlight inserted element
    highlightElement(arrayBars[j + 1], '#22c55e', 500);
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return array;
}

async function quickSort(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await quickSort(low, pivotIndex - 1);
    await quickSort(pivotIndex + 1, high);
  }
  return array;
}

async function partition(low, high) {
  const pivot = array[high];
  
  // Highlight pivot
  highlightElement(arrayBars[high], '#a855f7', 500);
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // Highlight current element
    highlightElement(arrayBars[j], '#3b82f6', 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (array[j] <= pivot) {
      i++;
      
      // Swap elements
      [array[i], array[j]] = [array[j], array[i]];
      
      // Update the UI
      updateArrayDisplay();
      
      // Animate the swap
      if (i !== j) {
        highlightElement(arrayBars[i], '#22c55e', 500);
        highlightElement(arrayBars[j], '#ef4444', 500);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Swap pivot to its correct position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  
  // Update the UI
  updateArrayDisplay();
  
  // Animate the swap
  if (i + 1 !== high) {
    highlightElement(arrayBars[i + 1], '#22c55e', 500);
    highlightElement(arrayBars[high], '#ef4444', 500);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return i + 1;
}

async function mergeSort(left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    // Highlight current range
    for (let i = left; i <= right; i++) {
      highlightElement(arrayBars[i], '#3b82f6', 300);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
  }
  
  return array;
}

async function merge(left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  const L = new Array(n1);
  const R = new Array(n2);
  
  // Populate left and right arrays
  for (let i = 0; i < n1; i++) L[i] = array[left + i];
  for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];
  
  let i = 0, j = 0, k = left;
  
  while (i < n1 && j < n2) {
    // Highlight elements being compared
    if (left + i <= mid && mid + 1 + j <= right) {
      highlightElement(arrayBars[left + i], '#f97316', 300);
      highlightElement(arrayBars[mid + 1 + j], '#f97316', 300);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    
    // Update the UI and highlight merged element
    updateArrayDisplay();
    highlightElement(arrayBars[k], '#22c55e', 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    k++;
  }
  
  // Copy remaining elements
  while (i < n1) {
    array[k] = L[i];
    
    // Update the UI and highlight merged element
    updateArrayDisplay();
    highlightElement(arrayBars[k], '#22c55e', 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    i++;
    k++;
  }
  
  while (j < n2) {
    array[k] = R[j];
    
    // Update the UI and highlight merged element
    updateArrayDisplay();
    highlightElement(arrayBars[k], '#22c55e', 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    j++;
    k++;
  }
  
  return array;
}

// Helper function to update the display of array elements
function updateArrayDisplay() {
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...array);
  
  // Update each bar
  array.forEach((value, index) => {
    const bar = arrayBars[index];
    const barHeight = Math.max(30, (value / maxValue) * 220);
    
    bar.style.height = `${barHeight}px`;
    bar.querySelector('span').textContent = value;
  });
}