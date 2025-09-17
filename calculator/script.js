const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = ''; // stores the full expression

// Handle button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        const action = button.dataset.action;

        if (number !== undefined) {
            if (number === '.' && expression.endsWith('.')) return;
            expression += number;
            display.textContent = expression;
        }

        if (action) {
            switch(action) {
                case 'clear':
                    expression = '';
                    display.textContent = '0';
                    removeOperatorHighlight();
                    break;
                case 'delete':
                    expression = expression.slice(0, -1);
                    display.textContent = expression || '0';
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    if (expression === '') return;
                    expression += getOperatorSymbol(action);
                    display.textContent = expression;
                    highlightOperator(action);
                    break;
                case 'equals':
                    calculateResult();
                    break;
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (!isNaN(key) || key === '.') {
        expression += key;
        display.textContent = expression;
    } else {
        switch(key) {
            case '+': expression += ' + '; highlightOperator('add'); break;
            case '-': expression += ' − '; highlightOperator('subtract'); break;
            case '*': expression += ' × '; highlightOperator('multiply'); break;
            case '/': expression += ' ÷ '; highlightOperator('divide'); break;
            case 'Enter': calculateResult(); break;
            case 'Backspace': expression = expression.slice(0, -1); display.textContent = expression || '0'; break;
            case 'Escape': expression = ''; display.textContent = '0'; removeOperatorHighlight(); break;
        }
    }
});

// Highlight operator button
function highlightOperator(op) {
    removeOperatorHighlight();
    const btn = document.querySelector(`.btn[data-action="${op}"]`);
    if(btn) btn.classList.add('active-operator');
}

// Remove highlight
function removeOperatorHighlight() {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active-operator'));
}

// Calculate the result
function calculateResult() {
    try {
        let result = eval(
            expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
        );
        display.textContent = result;
        expression = result.toString(); // allow further calculations
        removeOperatorHighlight();
    } catch {
        display.textContent = 'Error';
        expression = '';
    }
}

// Map action to symbols
function getOperatorSymbol(op) {
    switch(op) {
        case 'add': return ' + ';
        case 'subtract': return ' − ';
        case 'multiply': return ' × ';
        case 'divide': return ' ÷ ';
        default: return '';
    }
}
