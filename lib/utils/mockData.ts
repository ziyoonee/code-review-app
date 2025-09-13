import type { Review, Suggestion, SeverityLevel, ReviewStyle, ReviewStatus, SuggestionStatus } from '@/types/review.types';

const sampleSuggestions: Partial<Suggestion>[] = [
  {
    severity: 'critical',
    title: 'Potential null reference exception',
    rationale: 'The variable `user` might be null when accessed. Add null check to prevent runtime errors.',
    tags: ['null-safety', 'bug', 'runtime-error'],
    confidence: 92
  },
  {
    severity: 'major',
    title: 'Unused variable detected',
    rationale: 'The variable `tempData` is declared but never used. Remove it to clean up the code.',
    tags: ['cleanup', 'unused-code'],
    confidence: 98
  },
  {
    severity: 'minor',
    title: 'Consider using const instead of let',
    rationale: 'The variable `config` is never reassigned. Use `const` for better code clarity.',
    tags: ['best-practice', 'es6'],
    confidence: 95
  },
  {
    severity: 'info',
    title: 'Missing JSDoc comment',
    rationale: 'Add JSDoc comment to document the function parameters and return value.',
    tags: ['documentation', 'jsdoc'],
    confidence: 88
  },
  {
    severity: 'major',
    title: 'Async function without error handling',
    rationale: 'The async function lacks try-catch block. Add error handling for better reliability.',
    tags: ['error-handling', 'async', 'reliability'],
    confidence: 90
  },
  {
    severity: 'critical',
    title: 'SQL injection vulnerability',
    rationale: 'Direct string concatenation in SQL query. Use parameterized queries to prevent SQL injection.',
    tags: ['security', 'sql-injection', 'vulnerability'],
    confidence: 96
  },
  {
    severity: 'minor',
    title: 'Magic number detected',
    rationale: 'The number `86400000` should be extracted to a named constant for better readability.',
    tags: ['readability', 'magic-number'],
    confidence: 85
  },
  {
    severity: 'major',
    title: 'Missing array bounds check',
    rationale: 'Accessing array element without checking length. May cause index out of bounds error.',
    tags: ['array-safety', 'bounds-check'],
    confidence: 89
  }
];

const sampleCode = `function processUserData(users) {
  let tempData = [];
  let config = {
    maxUsers: 100,
    timeout: 86400000
  };
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const result = await fetchUserDetails(user.id);
    
    if (result.status === 'active') {
      const query = "SELECT * FROM orders WHERE user_id = " + user.id;
      const orders = await db.query(query);
      
      user.orders = orders[0];
      user.lastLogin = Date.now();
    }
  }
  
  return users;
}

async function fetchUserDetails(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return data;
}

function calculateDiscount(price, discountPercent) {
  const discountAmount = price * (discountPercent / 100);
  return price - discountAmount;
}`;

export function generateMockReview(options?: {
  id?: string;
  style?: ReviewStyle;
  status?: ReviewStatus;
  suggestionCount?: number;
}): Review {
  const id = options?.id || `review-${Date.now()}`;
  const style = options?.style || 'detail';
  const status = options?.status || 'complete';
  const suggestionCount = options?.suggestionCount || 8;
  
  const suggestions: Suggestion[] = [];
  const lines = sampleCode.split('\n');
  
  for (let i = 0; i < Math.min(suggestionCount, sampleSuggestions.length); i++) {
    const template = sampleSuggestions[i];
    const lineNumber = Math.floor(Math.random() * lines.length) + 1;
    
    suggestions.push({
      id: `sug-${i + 1}`,
      severity: template.severity as SeverityLevel,
      title: template.title!,
      rationale: template.rationale!,
      range: {
        start: lineNumber,
        end: lineNumber,
        startColumn: 1,
        endColumn: lines[lineNumber - 1]?.length || 80
      },
      fix: {
        diff: `- ${lines[lineNumber - 1] || ''}
+ // TODO: Fix ${template.title}`,
        description: `Apply fix for: ${template.title}`
      },
      tags: template.tags!,
      confidence: template.confidence!,
      status: 'pending' as SuggestionStatus,
      createdAt: new Date()
    });
  }
  
  return {
    id,
    code: sampleCode,
    language: 'javascript',
    style,
    status,
    suggestions,
    summary: `Found ${suggestions.length} potential improvements in your code. ${suggestions.filter(s => s.severity === 'critical').length} critical issues require immediate attention.`,
    metrics: {
      totalSuggestions: suggestions.length,
      acceptedSuggestions: 0,
      rejectedSuggestions: 0,
      processingTime: Math.floor(Math.random() * 5000) + 2000,
      modelName: 'gpt-4-turbo',
      codeSize: sampleCode.length
    },
    createdAt: new Date(),
    completedAt: status === 'complete' ? new Date() : undefined
  };
}

export function generateMockSuggestionStream(
  onSuggestion: (suggestion: Suggestion) => void,
  onComplete: () => void,
  options?: {
    count?: number;
    interval?: number;
  }
) {
  const count = options?.count || 5;
  const interval = options?.interval || 1500;
  let index = 0;
  
  const timer = setInterval(() => {
    if (index >= count || index >= sampleSuggestions.length) {
      clearInterval(timer);
      onComplete();
      return;
    }
    
    const template = sampleSuggestions[index];
    const lineNumber = Math.floor(Math.random() * 30) + 1;
    
    const suggestion: Suggestion = {
      id: `stream-sug-${Date.now()}-${index}`,
      severity: template.severity as SeverityLevel,
      title: template.title!,
      rationale: template.rationale!,
      range: {
        start: lineNumber,
        end: lineNumber,
        startColumn: 1,
        endColumn: 80
      },
      tags: template.tags!,
      confidence: template.confidence!,
      status: 'pending',
      createdAt: new Date()
    };
    
    onSuggestion(suggestion);
    index++;
  }, interval);
  
  return () => clearInterval(timer);
}

export function generateRecentSessions(count: number = 5) {
  const languages = ['javascript', 'typescript', 'python', 'java', 'go'];
  const sessions = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i * 3);
    
    sessions.push({
      id: `session-${i + 1}`,
      title: `Code Review Session ${i + 1}`,
      language: languages[i % languages.length],
      createdAt: date,
      suggestionsCount: Math.floor(Math.random() * 20) + 5
    });
  }
  
  return sessions;
}