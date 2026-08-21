// Function to calculate the integer square root of a BigInt
function sqrtBigInt(value) {
    if (value < 0n) return -1n;
    if (value === 0n) return 0n;
    let x = value;
    let y = (x + 1n) / 2n;
    while (y < x) {
        x = y;
        y = (x + value / x) / 2n;
    }
    return x;
}

function checkPrime() {
    const inputElement = document.getElementById('numInput');
    const resultDiv = document.getElementById('result');
    const inputValue = inputElement.value.trim();

    // Show loading state for massive numbers
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<em>Calculating...</em>';

    // We use setTimeout so the browser UI has time to show "Calculating..." 
    // before the heavy math temporarily takes over the processor.
    setTimeout(() => {
        try {
            // 1. Validation: Ensure it's only digits (no decimals, negatives, or letters)
            if (!/^\d+$/.test(inputValue)) {
                resultDiv.innerHTML = '<span class="error-text">Please enter positive integer</span>';
                return;
            }

            // Use BigInt to handle infinitely large numbers
            const value = BigInt(inputValue);

            if (value === 0n) {
                resultDiv.innerHTML = '<span class="error-text">Please enter positive integer</span>';
                return;
            }

            if (value === 1n) {
                resultDiv.innerHTML = `<strong>1</strong> is neither prime nor composite.<div class="divisors-list"><strong>Dividents:</strong> 1</div>`;
                return;
            }

            // Safety limit to prevent browser crashing for absurd numbers (e.g., 20+ digits)
            // A square root limit of 100,000,000 takes about 1-2 seconds on modern computers.
            const limit = sqrtBigInt(value);
            if (limit > 100000000n) {
                resultDiv.innerHTML = `<span class="error-text">Number is too massively large to safely compute in a web browser without crashing. Try a number up to 16 digits.</span>`;
                return;
            }

            // 2. Optimized Divisor Calculation: Only loop up to the square root
            let divisorsSmall = [];
            let divisorsLarge = [];

            for (let i = 1n; i <= limit; i++) {
                if (value % i === 0n) {
                    divisorsSmall.push(i);
                    
                    let pair = value / i;
                    // Prevent pushing the exact same number twice for perfect squares (like 25 = 5x5)
                    if (pair !== i) {
                        divisorsLarge.push(pair);
                    }
                }
            }

            // A number is prime if it ONLY has 2 divisors (1 and itself)
            const isPrime = (divisorsSmall.length + divisorsLarge.length) === 2;

            // 3. Display result
            if (isPrime) {
                // .toString() is required to safely render BigInts to the HTML
                resultDiv.innerHTML = `<strong>${value.toString()}</strong> is a <span class="success-text">Prime Number</span>!`;
            } else {
                // Reverse the large divisors so they appear in perfect numerical order
                divisorsLarge.reverse();
                const allDivisors = divisorsSmall.concat(divisorsLarge);
                
                // Format the array of BigInts into a comma-separated string
                const formattedDivisors = allDivisors.map(d => d.toString()).join(', ');

                resultDiv.innerHTML = `
                    <strong>${value.toString()}</strong> is <span class="error-text">not a Prime Number</span>.
                    <div class="divisors-list">
                        <strong>Dividents:</strong> ${formattedDivisors}
                    </div>
                `;
            }
        } catch (error) {
            resultDiv.innerHTML = '<span class="error-text">Please enter positive integer</span>';
        }
    }, 10);
}

// Allow pressing "Enter" to trigger the check
document.getElementById('numInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPrime();
    }
});