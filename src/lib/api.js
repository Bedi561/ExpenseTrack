
const API_URL = 'http://localhost:5000';

export async function fetchExpenses(filter = {}) {
  const params = new URLSearchParams();
  
  // Add any filters to the query parameters
  Object.entries(filter).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });
  
  const query = params.toString() ? `?${params.toString()}` : '';
  
  try {
    const response = await fetch(`${API_URL}/expenses${query}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return await response.json();
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function fetchExpenseTotal(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  
  try {
    const response = await fetch(`${API_URL}/expenses/total?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch expense total');
    return await response.json();
  } catch (error) {
    console.error('Error fetching expense total:', error);
    throw error;
  }
}

export async function addExpense(expenseData) {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    
    if (!response.ok) throw new Error('Failed to add expense');
    return await response.json();
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}
