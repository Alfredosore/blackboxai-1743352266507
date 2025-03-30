import { members, groupGoal, totalContributed } from './data.js';

// Initialize data from localStorage if available
function loadData() {
  const savedMembers = localStorage.getItem('members');
  const savedGoal = localStorage.getItem('groupGoal');
  const savedTotal = localStorage.getItem('totalContributed');

  if (savedMembers) {
    members.forEach((member, index) => {
      member.contributions = JSON.parse(savedMembers)[index].contributions;
    });
  }
  if (savedGoal) groupGoal = parseInt(savedGoal);
  if (savedTotal) totalContributed = parseInt(savedTotal);
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('members', JSON.stringify(members));
  localStorage.setItem('groupGoal', groupGoal);
  localStorage.setItem('totalContributed', totalContributed);
}

// Calculate total contributions
function calculateTotal() {
  return members.reduce((sum, member) => {
    return sum + member.contributions.reduce((memberSum, contribution) => memberSum + contribution.amount, 0);
  }, 0);
}

// Add a new contribution
function addContribution(memberId, amount) {
  const member = members.find(m => m.id === memberId);
  if (member) {
    member.contributions.push({
      amount: amount,
      date: new Date().toISOString()
    });
    totalContributed += amount;
    saveData();
    return true;
  }
  return false;
}

// Update progress display
function updateProgress() {
  const progressElement = document.getElementById('progress-bar');
  if (progressElement) {
    const percentage = Math.min(100, (totalContributed / groupGoal) * 100);
    progressElement.style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = 
      `$${totalContributed} of $${groupGoal} (${percentage.toFixed(1)}%)`;
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateProgress();
  
  // Initialize contribution form if it exists
  const form = document.getElementById('contribution-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const memberId = parseInt(document.getElementById('member-select').value);
      const amount = parseFloat(document.getElementById('amount').value);
      
      if (memberId && amount > 0) {
        if (addContribution(memberId, amount)) {
          alert('Contribution recorded successfully!');
          form.reset();
          updateProgress();
        } else {
          alert('Error recording contribution');
        }
      } else {
        alert('Please select a member and enter a valid amount');
      }
    });
  }
});