// Memory configuration
let blocks = [20, 20, 40, 60, 20, 10, 60, 40, 20, 30, 40, 40];
let allocatedBlock = [true, false, true, false, true, false, true, false, true, false, true, false];

const memoryElement = document.querySelector('.memory');
drawMemoryVisualization(blocks, allocatedBlock);

function drawMemoryVisualization(holes, allocated) {
    memoryElement.innerHTML = '';

    // Draw each memory section
    let sectionStart = 0;
    for (let i = 0; i < holes.length; i++) {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'memory-section';
        sectionElement.style.width = `${holes[i] + 35}px`;
        sectionElement.style.left = `${sectionStart}px`;
        sectionElement.style.height = '145px';
        sectionElement.style.marginTop = '154px';

        if (allocated[i]) {
            sectionElement.classList.add('memory-allocated');
            sectionElement.textContent = `${holes[i]}MB`;
        } else {
            sectionElement.classList.add('memory-hole');
            sectionElement.textContent = `${holes[i]}MB`;
        }

        memoryElement.appendChild(sectionElement);
        sectionStart += holes[i] + 35;
    }
}

// First-fit algorithm
function firstFit(reqSize) {
    for (let i = 0; i < blocks.length; i++) {
        if (!allocatedBlock[i] && blocks[i] >= reqSize) {
            allocatedBlock[i] = true;
            if (blocks[i] > reqSize) {
                blocks.splice(i + 1, 0, blocks[i] - reqSize);
                allocatedBlock.splice(i + 1, 0, false);
            }
            blocks[i] = reqSize;
            drawMemoryVisualization(blocks, allocatedBlock);
            return true;
        }
    }
    alert(`Request of ${reqSize}MB could not be allocated.`);
    return false;
}

const firstBtn = document.querySelector('#first-fit');
firstBtn.addEventListener('click', () => {
    const reqSize = parseInt(prompt('Enter the size of the request (in MB):'));
    firstFit(reqSize);
});


function bestFit(requestSize) {
    // Create an array of available holes
    const availableHoles = [];
    for (let i = 0; i < blocks.length; i++) {
        if (!allocatedBlock[i] && blocks[i] >= requestSize) {
            availableHoles.push({ index: i, size: blocks[i] });
        }
    }

    // Find the smallest available hole that fits the request
    let bestFitIndex = -1;
    let bestFitSize = Infinity;
    for (const hole of availableHoles) {
        if (hole.size < bestFitSize) {
            bestFitIndex = hole.index;
            bestFitSize = hole.size;
        }
    }

    // If a suitable hole was found, allocate the request
    if (bestFitIndex !== -1) {
        allocatedBlock[bestFitIndex] = true;
        blocks[bestFitIndex] = requestSize;
        const remainingSpace = bestFitSize - requestSize;
        if (remainingSpace > 0) {
            allocatedBlock.splice(bestFitIndex + 1, 0, false);
            blocks.splice(bestFitIndex + 1, 0, remainingSpace);
        }
        drawMemoryVisualization(blocks, allocatedBlock);
    }

    return bestFitIndex;
}

const bestBtn = document.querySelector('#best-fit');
bestBtn.addEventListener('click', () => {
    const requestSize = parseInt(prompt('Enter the size of request (in MB):'));
    const index = bestFit(requestSize);
    if (index !== -1) {
        alert(`Memory allocated at index ${index+1}.`);
    } else {
        alert('Unable to allocate memory.');
    }
});


// // Next-fit algorithm
// let lastBlockIndex = -1;
// function nextFit(requestSize) {
//     for (let i = 0; i < blocks.length; i++) {
//         const index = (lastBlockIndex + i + 1) % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
//             allocatedBlock[index] = true;
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
//
//     return -1;
// }

// Next-fit algorithm
// function nextFit(requestSize) {
//     // Scan memory starting from the last placement
//     for (let i = 0; i < blocks.length; i++) {
//         const index = (lastBlockIndex + i + 1) % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
//             // Allocate the block of memory
//             allocatedBlock[index] = true;
//             if (blocks[index] > requestSize) {
//                 // Split the hole into allocated and unallocated parts
//                 const newIndex = index + 1;
//                 blocks.splice(newIndex, 0, blocks[index] - requestSize);
//                 allocatedBlock.splice(newIndex, 0, false);
//                 blocks[index] = requestSize;
//             }
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
//     // If no block of memory is found in the forward direction, scan the memory backwards
//     for (let i = blocks.length - 1; i > lastBlockIndex; i--) {
//         const index = i % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
// // Allocate the block of memory
//             allocatedBlock[index] = true;
//             if (blocks[index] > requestSize) {
// // Split the hole into allocated and unallocated parts
//                 const newIndex = index + 1;
//                 blocks.splice(newIndex, 0, blocks[index] - requestSize);
//                 allocatedBlock.splice(newIndex, 0, false);
//                 blocks[index] = requestSize;
//             }
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
// // If no block of memory is found, display an alert
//     alert(`Memory request of ${requestSize}MB could not be allocated.`);
//     return -1;
// }

// function nextFit(requestSize) {
//     // Scan memory starting from the last placement
//     for (let i = 0; i < blocks.length; i++) {
//         const index = (lastBlockIndex + i + 1) % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
//             // Allocate the block of memory
//             allocatedBlock[index] = true;
//             if (blocks[index] > requestSize) {
//                 // Split the hole into allocated and unallocated parts
//                 const newIndex = index + 1;
//                 blocks.splice(newIndex, 0, blocks[index] - requestSize);
//                 allocatedBlock.splice(newIndex, 0, false);
//                 blocks[index] = requestSize;
//             }
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
//
//     // If no block of memory is found in the forward direction, scan the memory backwards
//     for (let i = lastBlockIndex; i >= 0; i--) {
//         const index = i % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
//             // Allocate the block of memory
//             allocatedBlock[index] = true;
//             if (blocks[index] > requestSize) {
//                 // Split the hole into allocated and unallocated parts
//                 const newIndex = index + 1;
//                 blocks.splice(newIndex, 0, blocks[index] - requestSize);
//                 allocatedBlock.splice(newIndex, 0, false);
//                 blocks[index] = requestSize;
//             }
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
//
//     // If no block of memory is found in the backward direction, scan the memory forwards from the beginning
//     for (let i = 0; i < lastBlockIndex; i++) {
//         const index = i % blocks.length;
//         if (!allocatedBlock[index] && blocks[index] >= requestSize) {
//             // Allocate the block of memory
//             allocatedBlock[index] = true;
//             if (blocks[index] > requestSize) {
//                 // Split the hole into allocated and unallocated parts
//                 const newIndex = index + 1;
//                 blocks.splice(newIndex, 0, blocks[index] - requestSize);
//                 allocatedBlock.splice(newIndex, 0, false);
//                 blocks[index] = requestSize;
//             }
//             blocks[index] -= requestSize;
//             lastBlockIndex = index;
//             drawMemoryVisualization(blocks, allocatedBlock);
//             return index;
//         }
//     }
//
//     // If no block of memory is found, display an alert
//     alert(`Memory request of ${requestSize}MB could not be allocated.`);
//     return -1;
// }

let lastBlockIndex = -1;
function nextFit(requestSize) {
    // Scan memory starting from the last placement
    for (let i = 0; i < blocks.length; i++) {
        const index = (lastBlockIndex + i + 1) % blocks.length;
        if (!allocatedBlock[index] && blocks[index] >= requestSize) {
            // Allocate the block of memory
            allocatedBlock[index] = true;
            if (blocks[index] > requestSize) {
                // Split the hole into allocated and unallocated parts
                const newIndex = index + 1;
                blocks.splice(newIndex, 0, blocks[index] - requestSize);
                allocatedBlock.splice(newIndex, 0, false);
                blocks[index] = requestSize;
            }
            blocks[index] -= requestSize;

            // Paint the remaining part of the hole white if it is free to fit the next request
            if (blocks[index] > 0 && !allocatedBlock[index+1]) {
                allocatedBlock[index] = false;
                allocatedBlock[index+1] = false;
            }

            lastBlockIndex = index;
            drawMemoryVisualization(blocks, allocatedBlock);
            return index;
        }
    }

    // If no block of memory is found in the forward direction, scan the memory backwards
    for (let i = blocks.length - 1; i > lastBlockIndex; i--) {
        const index = i % blocks.length;
        if (!allocatedBlock[index] && blocks[index] >= requestSize) {
            // Allocate the block of memory
            allocatedBlock[index] = true;
            if (blocks[index] > requestSize) {
                // Split the hole into allocated and unallocated parts
                const newIndex = index + 1;
                blocks.splice(newIndex, 0, blocks[index] - requestSize);
                allocatedBlock.splice(newIndex, 0, false);
                blocks[index] = requestSize;
            }
            blocks[index] -= requestSize;

            // Paint the remaining part of the hole white if it is free to fit the next request
            if (blocks[index] > 0 && !allocatedBlock[index+1]) {
                allocatedBlock[index] = false;
                allocatedBlock[index+1] = false;
            }

            lastBlockIndex = index;
            drawMemoryVisualization(blocks, allocatedBlock);
            return index;
        }
    }

    // If no block of memory is found, display an alert
    alert(`Memory request of ${requestSize}MB could not be allocated.`);
    return -1;
}

const nextBtn = document.querySelector('#next-fit');
nextBtn.addEventListener('click', () => {
    const requestSize = parseInt(prompt('Enter the size of request (in MB):'));
    nextFit(requestSize);
});


const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', () => {
    let init = [20, 20, 40, 60, 20, 10, 60, 40, 20, 30, 40, 40];
    blocks = init
    allocatedBlock = [true, false, true, false, true, false, true, false, true, false, true, false];
    drawMemoryVisualization(blocks, allocatedBlock);
});