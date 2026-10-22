// State Config 
const container = document.getElementById("visualizer-container"); 
const btnRandom = document.getElementById("btn-random"); 
const btnSort = document.getElementById("btn-sort"); 
const algoSelect = document.getElementById("algo-select"); 
const speedRange = document.getElementById("speed-range"); 
const statComparisons = 
document.getElementById("stat-comparisons"); 
const statSwaps = document.getElementById("stat-swaps"); 
 
let array = []; 
const ARRAY_SIZE = 60; // Total number of visual elements/bars 
let comparisons = 0; 
let swaps = 0; 
let isSorting = false; 
 
// 1. Array Generation Utilities 
function generateRandomArray() { 
    if (isSorting) return; 
     
    array = []; 
    container.innerHTML = ""; 
    comparisons = 0; 
    swaps = 0; 
    updateStats(); 
 
    for (let i = 0; i < ARRAY_SIZE; i++) { 
        // Generates random height percentages between 5% and 95% 
        array.push(Math.floor(Math.random() * 90) + 5); 
    } 
 
    // Generate DOM elements 
    for (let i = 0; i < array.length; i++) { 
        const bar = document.createElement("div"); 
        bar.classList.add("bar"); 
        bar.style.height = `${array[i]}%`; 
        container.appendChild(bar); 
    } 
} 
 
// 2. Control & Delay Animations 
function getDelay() { 
    // Inverse mapping so high range value = short delay (faster animation) 
    const val = parseInt(speedRange.value); 
    return Math.max(2, 250 - (val * 2.4));  
} 
 
function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
} 
 
function updateStats() { 
    statComparisons.innerText = comparisons; 
    statSwaps.innerText = swaps; 
} 
 
function toggleControls(disabled) { 
    isSorting = disabled; 
    btnRandom.disabled = disabled; 
    btnSort.disabled = disabled; 
    algoSelect.disabled = disabled; 
} 
 
// Helper to recolor bars array-wise 
function setColor(index, color) { 
    const bars = container.children; 
    if (bars[index]) { 
        bars[index].style.backgroundColor = color; 
    } 
} 
 
// Helper to swap bar DOM heights directly 
function swapBars(i, j) { 
    const bars = container.children; 
    let tempHeight = bars[i].style.height; 
    bars[i].style.height = bars[j].style.height; 
    bars[j].style.height = tempHeight; 
     
    // Maintain state matching the backing array variables 
    let tempVal = array[i]; 
    array[i] = array[j]; 
    array[j] = tempVal; 
} 
 
// 3. Sorting Algorithms Implementation 
async function bubbleSort() { 
    const bars = container.children; 
    const n = array.length; 
     
    for (let i = 0; i < n - 1; i++) { 
        for (let j = 0; j < n - i - 1; j++) { 
            // Highlight active elements under comparison 
            setColor(j, "var(--accent-compare)"); 
            setColor(j + 1, "var(--accent-compare)"); 
            comparisons++; 
            updateStats(); 
            await sleep(getDelay()); 
 
            if (array[j] > array[j + 1]) { 
                // Change color if a swap must occur 
                setColor(j, "var(--accent-swap)"); 
                setColor(j + 1, "var(--accent-swap)"); 
                swapBars(j, j + 1); 
                swaps++; 
                updateStats(); 
                await sleep(getDelay()); 
            } 
 
            // Revert color back to base style 
            setColor(j, "var(--primary-color)"); 
            setColor(j + 1, "var(--primary-color)"); 
        } 
        // Last element is completely sorted 
        setColor(n - i - 1, "var(--accent-sorted)"); 
    } 
    setColor(0, "var(--accent-sorted)"); 
} 
 
async function selectionSort() { 
    const bars = container.children; 
    const n = array.length; 
 
    for (let i = 0; i < n; i++) { 
        let minIdx = i; 
        setColor(minIdx, "var(--accent-swap)"); // Current minimum target tracker 
 
        for (let j = i + 1; j < n; j++) { 
            setColor(j, "var(--accent-compare)"); 
            comparisons++; 
            updateStats(); 
            await sleep(getDelay()); 
 
            if (array[j] < array[minIdx]) { 
                setColor(minIdx, "var(--primary-color)"); // Revert old minimum 
                minIdx = j; 
                setColor(minIdx, "var(--accent-swap)"); // Set new minimum tracking color 
            } else { 
                setColor(j, "var(--primary-color)"); 
            } 
        } 
 
        if (minIdx !== i) { 
            swapBars(i, minIdx); 
            swaps++; 
            updateStats(); 
            await sleep(getDelay()); 
        } 
         
        setColor(minIdx, "var(--primary-color)"); 
        setColor(i, "var(--accent-sorted)"); // Element is fixed in its place 
    } 
} 
 
// 4. Runtime Listeners 
btnRandom.addEventListener("click", generateRandomArray); 
 
btnSort.addEventListener("click", async () => { 
    toggleControls(true); 
    const selectedAlgo = algoSelect.value; 
     
    if (selectedAlgo === "bubble") { 
        await bubbleSort(); 
} else if (selectedAlgo === "selection") { 
await selectionSort(); 
} 
toggleControls(false); 
}); 
// Initialize app on load 
generateRandomArray();