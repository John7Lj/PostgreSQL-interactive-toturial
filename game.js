/* =============================================
   POSTGRESQL QUEST — GAME ENGINE
   ============================================= */

// ── STATE ─────────────────────────────────────
const STATE = {
  xp: 0,
  playerLevel: 1,
  currentLevel: 0,
  completedLevels: new Set(),
  levelProgress: {}, // levelIndex -> { step, score, done }
  badges: []
};

const XP_PER_LEVEL = [100,150,200,250,300,350,400,450,500,600];

// ── LEVELS DATA ───────────────────────────────
const LEVELS = [

  /* ════ LEVEL 0 ════ */
  {
    id: 0,
    icon: '📖',
    title: 'What is PostgreSQL?',
    tag: 'Level 1 · Fundamentals',
    desc: 'Understand what PostgreSQL is, why it matters, and how databases are structured.',
    xpReward: 50,
    steps: [

      // ── STEP 0: Theory ──
      {
        type: 'theory',
        title: 'Databases & PostgreSQL',
        content: `
          <p class="theory-text">
            A <strong>database</strong> is data structured into rows and columns — like a spreadsheet — but with superpowers.
            You interact with it by sending commands called <em>queries</em>, and it returns results.
          </p>
          <p class="theory-text" style="margin-top:.75rem">
            <strong>PostgreSQL</strong> (or Postgres) is an <em>object-relational database</em> that:
          </p>
          <div class="info-box tip" style="margin:.75rem 0">
            <span class="info-box-icon">⚡</span>
            <div>
              <strong>Is just as fast as MySQL</strong> but adheres more closely to SQL standards,
              excels at <em>concurrency</em>, avoids data corruption better,
              and supports advanced data types + custom operators.
            </div>
          </div>
          <p class="theory-text">Key terms you'll encounter:</p>
          <ul style="margin:.6rem 0 0 1.2rem; line-height:2.2; font-size:.88rem; color:var(--text)">
            <li><strong>Table</strong> — a collection of rows & columns (like a spreadsheet tab)</li>
            <li><strong>Row</strong> — one record (one student, one order, etc.)</li>
            <li><strong>Column</strong> — one data field (name, price, date…)</li>
            <li><strong>Cell</strong> — the individual value at a row/column intersection</li>
            <li><strong>Primary Key</strong> — a unique ID for each row</li>
            <li><strong>Query</strong> — the command you send to ask for or change data</li>
          </ul>
        `
      },

      // ── STEP 1: Visual diagram ──
      {
        type: 'theory',
        title: 'Database Structure',
        content: `
          <p class="theory-text">Imagine storing student data. Each student is a <strong>row</strong>. Each property is a <strong>column</strong>:</p>
          <div class="diagram">
            <div style="margin-bottom:.75rem; color:var(--cyan); font-weight:700">TABLE: student</div>
            <table style="border-collapse:collapse; width:100%">
              <tr style="background:var(--bg3)">
                <th style="padding:.4rem .75rem; color:var(--amber); border:1px solid var(--border); text-align:left">id 🔑</th>
                <th style="padding:.4rem .75rem; color:var(--cyan); border:1px solid var(--border); text-align:left">first_name</th>
                <th style="padding:.4rem .75rem; color:var(--cyan); border:1px solid var(--border); text-align:left">last_name</th>
                <th style="padding:.4rem .75rem; color:var(--cyan); border:1px solid var(--border); text-align:left">birth_date</th>
              </tr>
              <tr>
                <td style="padding:.4rem .75rem; border:1px solid var(--border); color:var(--amber)">1</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">Alice</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">Smith</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">2001-04-12</td>
              </tr>
              <tr>
                <td style="padding:.4rem .75rem; border:1px solid var(--border); color:var(--amber)">2</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">Bob</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">Jones</td>
                <td style="padding:.4rem .75rem; border:1px solid var(--border)">2000-09-30</td>
              </tr>
            </table>
            <div style="margin-top:.75rem; font-size:.72rem">
              🔑 <span style="color:var(--amber)">id</span> = Primary Key (unique, auto-increments)
            </div>
          </div>
          <div class="info-box note">
            <span class="info-box-icon">💡</span>
            <div>PostgreSQL is best when <strong>extensibility, scalability and data integrity</strong> are your priorities. 
            Tools like <strong>PGAdmin4</strong> let you connect to and manage databases visually.</div>
          </div>
        `
      },

      // ── STEP 2: MCQ ──
      {
        type: 'mcq',
        question: 'What is a "Primary Key" in a database table?',
        options: [
          'The first column in any table',
          'A unique value that identifies each row',
          'The most important piece of data stored',
          'A password that protects the table'
        ],
        correct: 1,
        explanation: 'A Primary Key is a <strong>unique identifier</strong> for each row. It ensures every record can be precisely referenced. In Postgres, the SERIAL type auto-increments it for you.',
        xp: 10
      },

      // ── STEP 3: MCQ ──
      {
        type: 'mcq',
        question: 'Which of these best describes a "query"?',
        options: [
          'A type of database column',
          'A command you send to the database to get or change data',
          'A backup copy of your database',
          'A visual chart of your table structure'
        ],
        correct: 1,
        explanation: 'A <strong>query</strong> is a command (written in SQL) that you send to the database. The database executes it and returns a result or performs an action.',
        xp: 10
      },

      // ── STEP 4: Fill blank ──
      {
        type: 'fillblank',
        template: 'A database stores data in [BLANK] and columns, similar to a [BLANK].',
        blanks: ['rows', 'spreadsheet'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 1 ════ */
  {
    id: 1,
    icon: '🔨',
    title: 'Creating Tables',
    tag: 'Level 2 · DDL',
    desc: 'Write your first CREATE TABLE statement and understand column definitions.',
    xpReward: 60,
    steps: [

      {
        type: 'theory',
        title: 'The CREATE TABLE Statement',
        content: `
          <p class="theory-text">Tables are the core structure of any database. You create them with <em>CREATE TABLE</em>:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="kw">CREATE TABLE</span> customer(
  first_name  <span class="tp">VARCHAR</span>(30)   <span class="kw">NOT NULL</span>,
  last_name   <span class="tp">VARCHAR</span>(30)   <span class="kw">NOT NULL</span>,
  email       <span class="tp">VARCHAR</span>(60)   <span class="kw">NOT NULL</span>,
  company     <span class="tp">VARCHAR</span>(60)   <span class="kw">NULL</span>,
  state       <span class="tp">CHAR</span>(2)       <span class="kw">NOT NULL DEFAULT</span> <span class="str">'PA'</span>,
  zip         <span class="tp">SMALLINT</span>      <span class="kw">NOT NULL</span>,
  birth_date  <span class="tp">DATE</span>          <span class="kw">NULL</span>,
  sex         <span class="tp">CHAR</span>(1)       <span class="kw">NOT NULL</span>,
  id          <span class="tp">SERIAL</span>        <span class="kw">PRIMARY KEY</span>
);</pre>
          </div>
          <p class="theory-text">Notice every column needs:</p>
          <ul style="margin:.5rem 0 0 1.2rem; line-height:2; font-size:.88rem; color:var(--text)">
            <li>A <strong>name</strong> (e.g. first_name)</li>
            <li>A <strong>data type</strong> (e.g. VARCHAR, SMALLINT)</li>
            <li>Optional <strong>constraints</strong> (NOT NULL, DEFAULT, PRIMARY KEY)</li>
          </ul>
          <div class="info-box tip">
            <span class="info-box-icon">🔑</span>
            <div>Always put <strong>id SERIAL PRIMARY KEY</strong> last (convention). SERIAL auto-increments, so you never insert the id manually.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Column Constraints',
        content: `
          <p class="theory-text">Constraints control what values are allowed in a column:</p>
          <table class="type-table">
            <tr><th>Constraint</th><th>Meaning</th><th>Example</th></tr>
            <tr>
              <td><span class="type-tag">NOT NULL</span></td>
              <td>Column must always have a value</td>
              <td style="font-family:var(--mono);font-size:.78rem;color:var(--text2)">first_name VARCHAR(30) NOT NULL</td>
            </tr>
            <tr>
              <td><span class="type-tag">NULL</span></td>
              <td>Column can be empty/missing</td>
              <td style="font-family:var(--mono);font-size:.78rem;color:var(--text2)">company VARCHAR(60) NULL</td>
            </tr>
            <tr>
              <td><span class="type-tag">DEFAULT</span></td>
              <td>Auto-fills a value if none given</td>
              <td style="font-family:var(--mono);font-size:.78rem;color:var(--text2)">state CHAR(2) DEFAULT 'PA'</td>
            </tr>
            <tr>
              <td><span class="type-tag">PRIMARY KEY</span></td>
              <td>Unique row identifier, never null</td>
              <td style="font-family:var(--mono);font-size:.78rem;color:var(--text2)">id SERIAL PRIMARY KEY</td>
            </tr>
          </table>
          <div class="info-box warn" style="margin-top:1rem">
            <span class="info-box-icon">⚠️</span>
            <div>If you mark a column <strong>NOT NULL</strong> and try to insert a row without a value for it — Postgres will reject the entire INSERT!</div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'You want a column that auto-generates a unique number for each new row. Which data type do you use?',
        options: ['INTEGER', 'SERIAL', 'VARCHAR', 'BOOLEAN'],
        correct: 1,
        explanation: '<strong>SERIAL</strong> is a special Postgres type that auto-increments. It\'s always used for primary key id columns. Under the hood it\'s an integer, but Postgres manages the counting for you.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'Which constraint ensures a column always has a value when a row is inserted?',
        options: ['DEFAULT', 'UNIQUE', 'NOT NULL', 'PRIMARY KEY'],
        correct: 2,
        explanation: '<strong>NOT NULL</strong> means the column cannot be left empty. If you try to INSERT a row without that column\'s value, Postgres rejects it with an error.',
        xp: 10
      },

      {
        type: 'drag',
        question: 'Build the CREATE TABLE header and id column:',
        template: '[BLANK] TABLE product( name VARCHAR(30) NOT NULL, id [BLANK] [BLANK] );',
        tokens: ['CREATE', 'SERIAL', 'PRIMARY KEY', 'SELECT', 'INSERT', 'INTEGER'],
        answers: ['CREATE', 'SERIAL', 'PRIMARY KEY'],
        xp: 20
      },

      {
        type: 'code',
        prompt: 'Write a SQL statement to create a table called "product_type" with one column: name VARCHAR(30) NOT NULL, and an id SERIAL PRIMARY KEY.',
        answer: 'product_type',
        answerAlt: ['product_type', 'serial', 'primary key'],
        hint: 'Hint: CREATE TABLE product_type( name VARCHAR(30) NOT NULL, id SERIAL PRIMARY KEY );',
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 2 ════ */
  {
    id: 2,
    icon: '🧱',
    title: 'Data Types',
    tag: 'Level 3 · Types',
    desc: 'Master Postgres data types: character, numeric, boolean, date/time, and more.',
    xpReward: 70,
    steps: [

      {
        type: 'theory',
        title: 'Character Types',
        content: `
          <p class="theory-text">Pick the right type for text storage:</p>
          <table class="type-table">
            <tr><th>Type</th><th>Description</th><th>Use When</th></tr>
            <tr>
              <td><span class="type-tag">CHAR(n)</span></td>
              <td>Exactly n characters (padded with spaces)</td>
              <td>Fixed-length codes like state abbreviations</td>
            </tr>
            <tr>
              <td><span class="type-tag">VARCHAR(n)</span></td>
              <td>Up to n characters</td>
              <td>Names, emails, most text fields</td>
            </tr>
            <tr>
              <td><span class="type-tag">TEXT</span></td>
              <td>Unlimited length string</td>
              <td>Descriptions, long content</td>
            </tr>
          </table>
          <div class="info-box tip">
            <span class="info-box-icon">💡</span>
            <div><em>state CHAR(2)</em> makes sense because US state codes are always exactly 2 chars (CA, TX, PA…). Use CHAR only when the length is truly fixed.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Numeric Types',
        content: `
          <p class="theory-text">Choose the right numeric type for precision and range:</p>
          <table class="type-table">
            <tr><th>Category</th><th>Type</th><th>Range / Use</th></tr>
            <tr>
              <td>Auto-increment</td>
              <td><span class="type-tag">SERIAL</span></td>
              <td>1 to 2,147,483,647 — always for primary keys</td>
            </tr>
            <tr>
              <td>Whole numbers</td>
              <td><span class="type-tag">SMALLINT</span></td>
              <td>-32,768 to 32,767 — zip codes, small counts</td>
            </tr>
            <tr>
              <td>Whole numbers</td>
              <td><span class="type-tag">INTEGER</span></td>
              <td>±2.1 billion — most counts, foreign keys</td>
            </tr>
            <tr>
              <td>Whole numbers</td>
              <td><span class="type-tag">BIGINT</span></td>
              <td>±9.2 quintillion — large IDs, order numbers</td>
            </tr>
            <tr>
              <td>Decimals (exact)</td>
              <td><span class="type-tag">NUMERIC(p,s)</span></td>
              <td>Prices, tax rates — NUMERIC(6,2) = $9999.99</td>
            </tr>
            <tr>
              <td>Decimals (approx)</td>
              <td><span class="type-tag">DOUBLE PRECISION</span></td>
              <td>Scientific data — 15 decimal places</td>
            </tr>
          </table>
          <div class="info-box warn">
            <span class="info-box-icon">💰</span>
            <div>For <strong>money / prices</strong>, always use <em>NUMERIC(p,s)</em> — never FLOAT. Floating point numbers have rounding errors that can corrupt financial calculations.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Boolean & Date/Time Types',
        content: `
          <p class="theory-text"><strong>Boolean</strong> stores true/false values. Postgres accepts many aliases:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span></div>
            <pre class="code-pre"><span class="cm">-- TRUE values: true, 1, t, y, yes, on</span>
<span class="cm">-- FALSE values: false, 0, f, n, no, off</span>
taxable  <span class="tp">BOOLEAN</span> <span class="kw">NOT NULL DEFAULT</span> <span class="kw">FALSE</span></pre>
          </div>
          <p class="theory-text" style="margin-top:1rem"><strong>Date / Time</strong> types are extremely powerful:</p>
          <table class="type-table">
            <tr><th>Type</th><th>Stores</th><th>Example</th></tr>
            <tr>
              <td><span class="type-tag">DATE</span></td>
              <td>Date only</td>
              <td style="font-family:var(--mono);font-size:.75rem;color:var(--text2)">1974-12-21</td>
            </tr>
            <tr>
              <td><span class="type-tag">TIME</span></td>
              <td>Time without timezone</td>
              <td style="font-family:var(--mono);font-size:.75rem;color:var(--text2)">13:30:00</td>
            </tr>
            <tr>
              <td><span class="type-tag">TIMESTAMP</span></td>
              <td>Date + time</td>
              <td style="font-family:var(--mono);font-size:.75rem;color:var(--text2)">2024-03-15 14:30:00</td>
            </tr>
            <tr>
              <td><span class="type-tag">INTERVAL</span></td>
              <td>Duration of time</td>
              <td style="font-family:var(--mono);font-size:.75rem;color:var(--text2)">'1 D 2 H 30 M'</td>
            </tr>
          </table>
          <div class="info-box note">
            <span class="info-box-icon">⏱️</span>
            <div>You can do math with dates! <em>'2024-03-15'::DATE + '7 days'::INTERVAL</em> = 2024-03-22. Very useful for deadlines and scheduling.</div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'You\'re storing a product price like $199.99. Which data type is BEST?',
        options: ['FLOAT', 'DOUBLE PRECISION', 'NUMERIC(6,2)', 'INTEGER'],
        correct: 2,
        explanation: '<strong>NUMERIC(6,2)</strong> stores up to 6 total digits with 2 after the decimal — perfect for prices. FLOAT/DOUBLE have rounding errors and should never be used for money.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'Which type stores "true" or "false" values?',
        options: ['BIT', 'CHAR(1)', 'BOOLEAN', 'TINYINT'],
        correct: 2,
        explanation: '<strong>BOOLEAN</strong> is the proper Postgres type for true/false. It also accepts aliases like 1/0, t/f, yes/no, on/off.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'You need to store a US state abbreviation (always exactly 2 letters). Best choice?',
        options: ['TEXT', 'VARCHAR(2)', 'CHAR(2)', 'SMALLINT'],
        correct: 2,
        explanation: '<strong>CHAR(2)</strong> is ideal for fixed-length strings. While VARCHAR(2) also works, CHAR(2) semantically signals "this is always exactly 2 characters" — which is correct for state codes.',
        xp: 10
      },

      {
        type: 'fillblank',
        template: 'To store a date like 2024-03-15, use the [BLANK] type. For duration of time, use [BLANK].',
        blanks: ['DATE', 'INTERVAL'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 3 ════ */
  {
    id: 3,
    icon: '📥',
    title: 'Inserting Data',
    tag: 'Level 4 · DML',
    desc: 'Add data to your tables with INSERT INTO statements.',
    xpReward: 65,
    steps: [

      {
        type: 'theory',
        title: 'INSERT INTO Statement',
        content: `
          <p class="theory-text">Adding rows to a table uses <em>INSERT INTO</em>:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Specify columns explicitly (recommended)</span>
<span class="kw">INSERT INTO</span> customer(first_name, last_name, email, state, zip)
<span class="kw">VALUES</span> (<span class="str">'Alice'</span>, <span class="str">'Smith'</span>, <span class="str">'alice@email.com'</span>, <span class="str">'CA'</span>, <span class="nm">90210</span>);

<span class="cm">-- Insert multiple rows at once</span>
<span class="kw">INSERT INTO</span> product_type (name) <span class="kw">VALUES</span>
  (<span class="str">'Business'</span>),
  (<span class="str">'Casual'</span>),
  (<span class="str">'Athletic'</span>);</pre>
          </div>
          <div class="info-box tip">
            <span class="info-box-icon">🎯</span>
            <div>Notice we <strong>don't insert the id</strong>. Since it's <em>SERIAL PRIMARY KEY</em>, Postgres assigns it automatically (1, 2, 3…). Also, <em>current_timestamp</em> is a built-in function that returns the current date+time.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'The SELECT Statement',
        content: `
          <p class="theory-text">After inserting, verify your data with <em>SELECT</em>:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Get ALL columns and ALL rows</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> customer;

<span class="cm">-- Get specific columns only</span>
<span class="kw">SELECT</span> first_name, last_name, email <span class="kw">FROM</span> customer;

<span class="cm">-- Combine columns with CONCAT, rename with AS</span>
<span class="kw">SELECT</span> <span class="fn">CONCAT</span>(first_name, <span class="str">' '</span>, last_name) <span class="kw">AS</span> full_name,
       phone, state
<span class="kw">FROM</span> customer;</pre>
          </div>
          <p class="theory-text" style="margin-top:.75rem">
            <em>*</em> means "all columns". <em>AS</em> creates an alias — a display name for the column in your results.
          </p>
        `
      },

      {
        type: 'mcq',
        question: 'You insert a row without specifying the "id" column (which is SERIAL PRIMARY KEY). What happens?',
        options: [
          'Postgres throws an error',
          'The id is automatically assigned the next available number',
          'The id is set to NULL',
          'The id is set to 0'
        ],
        correct: 1,
        explanation: '<strong>SERIAL</strong> auto-increments! Postgres keeps a sequence counter and assigns the next number automatically. You should never manually insert an id for a SERIAL column.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'What does SELECT * FROM sales_order; do?',
        options: [
          'Deletes all rows from sales_order',
          'Creates a copy of sales_order',
          'Returns all columns and all rows from sales_order',
          'Returns only the first row of sales_order'
        ],
        correct: 2,
        explanation: '<strong>SELECT *</strong> means "give me all columns". <strong>FROM sales_order</strong> specifies the table. Combined, it returns every row and every column in the table.',
        xp: 10
      },

      {
        type: 'drag',
        question: 'Put the INSERT statement in the right order:',
        template: '[BLANK] INTO product_type [BLANK] (name) [BLANK] (\'Casual\');',
        tokens: ['INSERT', 'VALUES', 'DELETE', 'SELECT', 'FROM', '(name)'],
        answers: ['INSERT', '(name)', 'VALUES'],
        xp: 15
      },

      {
        type: 'fillblank',
        template: 'To insert a row: [BLANK] INTO tablename(col1, col2) [BLANK] (val1, val2);',
        blanks: ['INSERT', 'VALUES'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 4 ════ */
  {
    id: 4,
    icon: '🔗',
    title: 'Primary & Foreign Keys',
    tag: 'Level 5 · Relationships',
    desc: 'Connect tables together using primary keys and foreign keys.',
    xpReward: 75,
    steps: [

      {
        type: 'theory',
        title: 'Foreign Keys — Linking Tables',
        content: `
          <p class="theory-text">
            A <strong>Foreign Key</strong> is a column that references the <em>Primary Key</em> of another table.
            It creates a relationship between tables.
          </p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- product_type table (referenced)</span>
<span class="kw">CREATE TABLE</span> product_type(
  name  <span class="tp">VARCHAR</span>(30) <span class="kw">NOT NULL</span>,
  id    <span class="tp">SERIAL</span>      <span class="kw">PRIMARY KEY</span>
);

<span class="cm">-- product table references product_type</span>
<span class="kw">CREATE TABLE</span> product(
  type_id     <span class="tp">INTEGER</span> <span class="kw">REFERENCES</span> product_type(id),
  name        <span class="tp">VARCHAR</span>(30)  <span class="kw">NOT NULL</span>,
  supplier    <span class="tp">VARCHAR</span>(30)  <span class="kw">NOT NULL</span>,
  description <span class="tp">TEXT</span>         <span class="kw">NOT NULL</span>,
  id          <span class="tp">SERIAL</span>       <span class="kw">PRIMARY KEY</span>
);</pre>
          </div>
          <div class="info-box warn">
            <span class="info-box-icon">⚠️</span>
            <div>Foreign keys use <strong>INTEGER</strong>, not SERIAL. SERIAL would try to auto-assign values. You want to control which id you're referencing.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Schema Diagram',
        content: `
          <p class="theory-text">Here's how our shoe store tables relate to each other:</p>
          <div class="diagram">
            <div class="diagram-tables">
              <div class="table-diagram">
                <div class="td-header">🏷️ product_type</div>
                <div class="td-row"><span class="td-pk">id 🔑</span><span class="td-type">SERIAL</span></div>
                <div class="td-row"><span>name</span><span class="td-type">VARCHAR</span></div>
              </div>
              <div class="diagram-arrow">→</div>
              <div class="table-diagram">
                <div class="td-header">👟 product</div>
                <div class="td-row"><span class="td-pk">id 🔑</span><span class="td-type">SERIAL</span></div>
                <div class="td-row"><span class="td-fk">type_id 🔗</span><span class="td-type">INTEGER</span></div>
                <div class="td-row"><span>name</span><span class="td-type">VARCHAR</span></div>
                <div class="td-row"><span>supplier</span><span class="td-type">VARCHAR</span></div>
              </div>
              <div class="diagram-arrow">→</div>
              <div class="table-diagram">
                <div class="td-header">📦 item</div>
                <div class="td-row"><span class="td-pk">id 🔑</span><span class="td-type">SERIAL</span></div>
                <div class="td-row"><span class="td-fk">product_id 🔗</span><span class="td-type">INTEGER</span></div>
                <div class="td-row"><span>size</span><span class="td-type">INTEGER</span></div>
                <div class="td-row"><span>color</span><span class="td-type">VARCHAR</span></div>
                <div class="td-row"><span>price</span><span class="td-type">NUMERIC</span></div>
              </div>
            </div>
            <div style="margin-top:.75rem; font-size:.7rem">
              🔑 Primary Key &nbsp;|&nbsp; 🔗 Foreign Key
            </div>
          </div>
          <p class="theory-text">Each item references a product, which references a product type. This is called <strong>referential integrity</strong> — you can't insert an item with a product_id that doesn't exist!</p>
        `
      },

      {
        type: 'mcq',
        question: 'Why does a foreign key column use INTEGER instead of SERIAL?',
        options: [
          'INTEGER is faster than SERIAL',
          'SERIAL would auto-assign values, but we need to manually specify which row we\'re referencing',
          'INTEGER supports NULL values',
          'Foreign keys always use the smallest possible type'
        ],
        correct: 1,
        explanation: '<strong>SERIAL auto-increments</strong>. If we used it for a foreign key, Postgres would assign a new sequential number instead of letting us specify which row in the other table we\'re referencing. We want to choose the id, so we use INTEGER.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'What happens if you try to INSERT a product with type_id = 999, but product_type table has no row with id = 999?',
        options: [
          'Postgres creates a product_type row with id 999 automatically',
          'The product is inserted with type_id set to NULL',
          'Postgres rejects the INSERT with a foreign key violation error',
          'The INSERT succeeds and type_id is ignored'
        ],
        correct: 2,
        explanation: 'This is <strong>referential integrity</strong>! Postgres enforces that the referenced id must exist. If you try to reference a non-existent id, you get a foreign key constraint violation error. This prevents "orphaned" data.',
        xp: 10
      },

      {
        type: 'fillblank',
        template: 'Foreign keys use [BLANK] type, not SERIAL. The keyword [BLANK] links to another table.',
        blanks: ['INTEGER', 'REFERENCES'],
        xp: 15
      },

      {
        type: 'mcq',
        question: 'In the item table, what does "product_id INTEGER REFERENCES product(id)" mean?',
        options: [
          'item.product_id must match an existing id in the product table',
          'item.product_id is a copy of the product table',
          'item.product_id creates a new product automatically',
          'item.product_id can store any integer value, ignoring product'
        ],
        correct: 0,
        explanation: 'It means <strong>item.product_id must reference a valid id in the product table</strong>. This is the foreign key constraint — it links item rows to specific product rows, maintaining data consistency.',
        xp: 10
      }
    ]
  },

  /* ════ LEVEL 5 ════ */
  {
    id: 5,
    icon: '🔍',
    title: 'Querying Data',
    tag: 'Level 6 · SELECT',
    desc: 'Use WHERE, ORDER BY, LIMIT, GROUP BY, and aggregate functions to slice your data.',
    xpReward: 80,
    steps: [

      {
        type: 'theory',
        title: 'WHERE, ORDER BY & LIMIT',
        content: `
          <p class="theory-text">These clauses filter, sort and limit your results:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- WHERE filters rows by condition</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> sales_item <span class="kw">WHERE</span> discount > <span class="nm">0.15</span>;

<span class="cm">-- ORDER BY sorts results (ASC default, DESC for reverse)</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> sales_item
<span class="kw">WHERE</span> discount > <span class="nm">0.15</span>
<span class="kw">ORDER BY</span> discount <span class="kw">DESC</span>;

<span class="cm">-- LIMIT caps how many rows you get back</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> sales_item
<span class="kw">WHERE</span> discount > <span class="nm">0.15</span>
<span class="kw">ORDER BY</span> discount <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="nm">5</span>;

<span class="cm">-- BETWEEN is cleaner than two comparisons</span>
<span class="kw">SELECT</span> time_order_taken <span class="kw">FROM</span> sales_order
<span class="kw">WHERE</span> time_order_taken <span class="kw">BETWEEN</span> <span class="str">'2018-12-01'</span> <span class="kw">AND</span> <span class="str">'2018-12-31'</span>;</pre>
          </div>
          <p class="theory-text" style="margin-top:.75rem">Comparison operators: <em>= &lt; &gt; &lt;= &gt;= &lt;&gt; !=</em></p>
          <p class="theory-text">Logical operators: <em>AND</em>, <em>OR</em>, <em>NOT</em></p>
        `
      },

      {
        type: 'theory',
        title: 'GROUP BY & Aggregate Functions',
        content: `
          <p class="theory-text"><strong>Aggregate functions</strong> compute a single value from multiple rows:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Get count, sum, min, max, average of item prices</span>
<span class="kw">SELECT</span>
  <span class="fn">COUNT</span>(*) <span class="kw">AS</span> Items,
  <span class="fn">SUM</span>(price)  <span class="kw">AS</span> Total_Value,
  <span class="fn">ROUND</span>(<span class="fn">AVG</span>(price), <span class="nm">2</span>) <span class="kw">AS</span> Avg_Price,
  <span class="fn">MIN</span>(price) <span class="kw">AS</span> Cheapest,
  <span class="fn">MAX</span>(price) <span class="kw">AS</span> Most_Expensive
<span class="kw">FROM</span> item;

<span class="cm">-- GROUP BY groups rows with same value</span>
<span class="cm">-- Count customers born in each month</span>
<span class="kw">SELECT</span>
  <span class="fn">EXTRACT</span>(<span class="tp">MONTH FROM</span> birth_date) <span class="kw">AS</span> Month,
  <span class="fn">COUNT</span>(*) <span class="kw">AS</span> Amount
<span class="kw">FROM</span> customer
<span class="kw">GROUP BY</span> Month
<span class="kw">ORDER BY</span> Month;

<span class="cm">-- HAVING filters AFTER grouping (WHERE filters before)</span>
<span class="kw">SELECT</span> <span class="fn">EXTRACT</span>(<span class="tp">MONTH FROM</span> birth_date) <span class="kw">AS</span> Month, <span class="fn">COUNT</span>(*)
<span class="kw">FROM</span> customer
<span class="kw">GROUP BY</span> Month
<span class="kw">HAVING</span> <span class="fn">COUNT</span>(*) > <span class="nm">1</span>
<span class="kw">ORDER BY</span> Month;</pre>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'DISTINCT & IN',
        content: `
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- DISTINCT removes duplicate values</span>
<span class="kw">SELECT DISTINCT</span> state <span class="kw">FROM</span> customer <span class="kw">ORDER BY</span> state;

<span class="cm">-- NOT IN excludes specific values</span>
<span class="kw">SELECT DISTINCT</span> state <span class="kw">FROM</span> customer
<span class="kw">WHERE</span> state != <span class="str">'CA'</span>
<span class="kw">ORDER BY</span> state;

<span class="cm">-- IN checks against a list of values</span>
<span class="kw">SELECT DISTINCT</span> state <span class="kw">FROM</span> customer
<span class="kw">WHERE</span> state <span class="kw">IN</span> (<span class="str">'CA'</span>, <span class="str">'TX'</span>, <span class="str">'NJ'</span>)
<span class="kw">ORDER BY</span> state;</pre>
          </div>
          <div class="info-box tip">
            <span class="info-box-icon">💡</span>
            <div>Use <strong>IN</strong> instead of many OR conditions — it's cleaner and more readable. <em>WHERE state IN ('CA','TX','NJ')</em> beats <em>WHERE state='CA' OR state='TX' OR state='NJ'</em></div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'What is the difference between WHERE and HAVING?',
        options: [
          'They are the same, just used in different Postgres versions',
          'WHERE filters rows BEFORE grouping; HAVING filters AFTER grouping (on aggregated results)',
          'WHERE works on numbers; HAVING works on strings',
          'HAVING is only available with ORDER BY'
        ],
        correct: 1,
        explanation: '<strong>WHERE</strong> filters individual rows before any grouping happens. <strong>HAVING</strong> filters groups after GROUP BY has aggregated them. You can\'t use aggregate functions like COUNT() in a WHERE clause — that\'s what HAVING is for.',
        xp: 15
      },

      {
        type: 'mcq',
        question: 'Which query returns the 3 most expensive items, most expensive first?',
        options: [
          'SELECT * FROM item ORDER BY price LIMIT 3',
          'SELECT * FROM item ORDER BY price DESC LIMIT 3',
          'SELECT * FROM item LIMIT 3 WHERE price MAX',
          'SELECT TOP 3 * FROM item ORDER BY price DESC'
        ],
        correct: 1,
        explanation: '<em>ORDER BY price DESC</em> sorts from highest to lowest. <em>LIMIT 3</em> keeps only the top 3. Note: Postgres uses <strong>LIMIT</strong>, not TOP (which is SQL Server syntax).',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'What does SELECT COUNT(*) FROM customer; return?',
        options: [
          'A list of all customers',
          'The total number of rows in the customer table',
          'The customer with the highest id',
          'An error — COUNT needs a column name'
        ],
        correct: 1,
        explanation: '<strong>COUNT(*)</strong> counts all rows, including those with NULL values. It returns a single number — the total row count. <em>COUNT(column_name)</em> would count non-NULL values in that specific column.',
        xp: 10
      },

      {
        type: 'drag',
        question: 'Arrange this query correctly:',
        template: '[BLANK] first_name, state [BLANK] customer [BLANK] state = \'TX\' [BLANK] first_name;',
        tokens: ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING'],
        answers: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
        xp: 20
      }
    ]
  },

  /* ════ LEVEL 6 ════ */
  {
    id: 6,
    icon: '🤝',
    title: 'JOINs',
    tag: 'Level 7 · JOINs',
    desc: 'Combine data from multiple tables using INNER JOIN, LEFT JOIN, and more.',
    xpReward: 90,
    steps: [

      {
        type: 'theory',
        title: 'INNER JOIN — The Most Common Join',
        content: `
          <p class="theory-text">A JOIN combines rows from 2+ tables based on a matching condition. The most common is <strong>INNER JOIN</strong> — it only returns rows where there's a match in both tables.</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Get item ids with their prices</span>
<span class="kw">SELECT</span> item_id, price
<span class="kw">FROM</span> item <span class="kw">INNER JOIN</span> sales_item
  <span class="kw">ON</span> item.id = sales_item.item_id
<span class="kw">ORDER BY</span> item_id;

<span class="cm">-- Add a WHERE condition on the join</span>
<span class="kw">SELECT</span> item_id, price
<span class="kw">FROM</span> item <span class="kw">INNER JOIN</span> sales_item
  <span class="kw">ON</span> item.id = sales_item.item_id
  <span class="kw">AND</span> price > <span class="nm">120.00</span>
<span class="kw">ORDER BY</span> item_id;</pre>
          </div>
          <div class="info-box note">
            <span class="info-box-icon">💡</span>
            <div>The <em>ON</em> clause matches the <strong>primary key</strong> of one table to the <strong>foreign key</strong> of the other. This is called an <strong>equijoin</strong> (joining on equality).</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Joining 3+ Tables',
        content: `
          <p class="theory-text">Chain multiple JOINs to pull from many tables at once:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Get order id, quantity, price and total from 3 tables</span>
<span class="kw">SELECT</span>
  sales_order.id,
  sales_item.quantity,
  item.price,
  (sales_item.quantity * item.price) <span class="kw">AS</span> Total
<span class="kw">FROM</span> sales_order
<span class="kw">JOIN</span> sales_item
  <span class="kw">ON</span> sales_item.sales_order_id = sales_order.id
<span class="kw">JOIN</span> item
  <span class="kw">ON</span> item.id = sales_item.item_id
<span class="kw">ORDER BY</span> sales_order.id;</pre>
          </div>
          <p class="theory-text" style="margin-top:.75rem">The pattern is: <strong>each JOIN needs an ON clause</strong> matching the two tables' keys.</p>
        `
      },

      {
        type: 'theory',
        title: 'LEFT JOIN — Include Unmatched Rows',
        content: `
          <p class="theory-text">A <strong>LEFT JOIN</strong> (or LEFT OUTER JOIN) returns ALL rows from the left table, even if there's no match in the right table. Unmatched right-side columns appear as NULL.</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Get all products, even those with no items in inventory</span>
<span class="kw">SELECT</span> name, supplier, price
<span class="kw">FROM</span> product <span class="kw">LEFT JOIN</span> item
  <span class="kw">ON</span> item.product_id = product.id
<span class="kw">ORDER BY</span> name;</pre>
          </div>
          <div class="info-box tip">
            <span class="info-box-icon">🎯</span>
            <div>
              <strong>INNER JOIN</strong>: only matched rows from both tables.<br>
              <strong>LEFT JOIN</strong>: all rows from LEFT table + matched rows from right (NULLs for no match).<br>
              <em>Tip: Avoid RIGHT JOINs — just swap the table order and use LEFT JOIN instead.</em>
            </div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'Which JOIN type returns rows only when there\'s a match in BOTH tables?',
        options: ['LEFT JOIN', 'INNER JOIN', 'CROSS JOIN', 'OUTER JOIN'],
        correct: 1,
        explanation: '<strong>INNER JOIN</strong> returns only rows where the join condition is true in both tables. If a product has no items in the item table, an INNER JOIN would exclude that product entirely.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'You have a product table and an item table. You want ALL products listed, even if they have no items yet. Which JOIN?',
        options: [
          'INNER JOIN (product is on the left)',
          'LEFT JOIN with product on the left',
          'RIGHT JOIN with item on the left',
          'CROSS JOIN'
        ],
        correct: 1,
        explanation: '<strong>LEFT JOIN with product on the left</strong> returns ALL rows from product (left table), and matches from item where available. Products with no items get NULL for item columns — but they still appear in results.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'In a JOIN, what does the ON clause specify?',
        options: [
          'Which columns to display in results',
          'The condition that matches rows between the two tables',
          'The sorting order of results',
          'Which table to query first'
        ],
        correct: 1,
        explanation: 'The <strong>ON clause</strong> defines the join condition — typically matching a primary key from one table to a foreign key in the other. Without ON, you\'d get a CROSS JOIN (every row × every row).',
        xp: 10
      },

      {
        type: 'fillblank',
        template: 'A [BLANK] JOIN only returns rows with matches in both tables. A [BLANK] JOIN returns all rows from the left table.',
        blanks: ['INNER', 'LEFT'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 7 ════ */
  {
    id: 7,
    icon: '👁️',
    title: 'Views & ALTER TABLE',
    tag: 'Level 8 · DDL Advanced',
    desc: 'Create stored views and modify existing tables with ALTER TABLE.',
    xpReward: 85,
    steps: [

      {
        type: 'theory',
        title: 'ALTER TABLE — Modify Existing Tables',
        content: `
          <p class="theory-text">After creating a table, you can modify it with <em>ALTER TABLE</em>:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Add a new column</span>
<span class="kw">ALTER TABLE</span> sales_item <span class="kw">ADD</span> day_of_week <span class="tp">VARCHAR</span>(8);

<span class="cm">-- Add a constraint to existing column</span>
<span class="kw">ALTER TABLE</span> sales_item <span class="kw">ALTER COLUMN</span> day_of_week <span class="kw">SET NOT NULL</span>;

<span class="cm">-- Rename a column</span>
<span class="kw">ALTER TABLE</span> sales_item <span class="kw">RENAME COLUMN</span> day_of_week <span class="kw">TO</span> weekday;

<span class="cm">-- Drop (delete) a column</span>
<span class="kw">ALTER TABLE</span> sales_item <span class="kw">DROP COLUMN</span> weekday;

<span class="cm">-- Change the data type of a column</span>
<span class="kw">ALTER TABLE</span> customer <span class="kw">ALTER COLUMN</span> zip <span class="kw">TYPE</span> <span class="tp">INTEGER</span>;

<span class="cm">-- Rename a whole table</span>
<span class="kw">ALTER TABLE</span> transaction_type <span class="kw">RENAME TO</span> transaction;

<span class="cm">-- Drop (delete) an entire table</span>
<span class="kw">DROP TABLE</span> transaction;</pre>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'CREATE VIEW',
        content: `
          <p class="theory-text">A <strong>VIEW</strong> is a saved SELECT query. It behaves like a table but is always up-to-date since it's computed from live data.</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="kw">CREATE VIEW</span> purchase_order_overview <span class="kw">AS</span>
<span class="kw">SELECT</span>
  sales_order.purchase_order_number,
  customer.company,
  sales_item.quantity,
  product.name,
  item.price,
  (sales_item.quantity * item.price) <span class="kw">AS</span> Total,
  <span class="fn">CONCAT</span>(sales_person.first_name, <span class="str">' '</span>, sales_person.last_name) <span class="kw">AS</span> Salesperson
<span class="kw">FROM</span> sales_order
<span class="kw">JOIN</span> sales_item <span class="kw">ON</span> sales_item.sales_order_id = sales_order.id
<span class="kw">JOIN</span> item       <span class="kw">ON</span> item.id = sales_item.item_id
<span class="kw">JOIN</span> customer   <span class="kw">ON</span> sales_order.cust_id = customer.id
<span class="kw">JOIN</span> product    <span class="kw">ON</span> product.id = item.product_id
<span class="kw">JOIN</span> sales_person <span class="kw">ON</span> sales_person.id = sales_order.sales_person_id
<span class="kw">ORDER BY</span> purchase_order_number;

<span class="cm">-- Use it just like a table!</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> purchase_order_overview;

<span class="cm">-- Delete a view</span>
<span class="kw">DROP VIEW</span> purchase_order_overview;</pre>
          </div>
          <div class="info-box warn">
            <span class="info-box-icon">⚠️</span>
            <div>To keep a view <strong>updatable</strong>, avoid: DISTINCT, UNION, Aggregate Functions, GROUP BY, or HAVING in the view definition.</div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'What is a VIEW in PostgreSQL?',
        options: [
          'A physical copy of a table stored on disk',
          'A saved SELECT query that behaves like a table and shows live data',
          'A type of index for speeding up queries',
          'A backup mechanism for your database'
        ],
        correct: 1,
        explanation: 'A <strong>VIEW</strong> is a stored query. Every time you SELECT from a view, Postgres runs the underlying query and returns current data. It\'s not a copy — changes to underlying tables are immediately reflected.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'You want to rename the column "phone" to "phone_number" in the customer table. Which command?',
        options: [
          'ALTER TABLE customer CHANGE phone TO phone_number;',
          'ALTER TABLE customer RENAME COLUMN phone TO phone_number;',
          'UPDATE TABLE customer SET phone = phone_number;',
          'MODIFY TABLE customer RENAME phone phone_number;'
        ],
        correct: 1,
        explanation: '<strong>ALTER TABLE … RENAME COLUMN … TO …</strong> is the correct Postgres syntax for renaming a column. Note: MySQL uses CHANGE instead, but Postgres uses RENAME COLUMN.',
        xp: 10
      },

      {
        type: 'drag',
        question: 'Build the command to add a column:',
        template: '[BLANK] TABLE sales_item [BLANK] notes [BLANK](100);',
        tokens: ['ALTER', 'ADD', 'VARCHAR', 'DROP', 'RENAME', 'TEXT'],
        answers: ['ALTER', 'ADD', 'VARCHAR'],
        xp: 15
      },

      {
        type: 'fillblank',
        template: 'To delete a view: [BLANK] VIEW view_name; To delete a table: [BLANK] TABLE table_name;',
        blanks: ['DROP', 'DROP'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 8 ════ */
  {
    id: 8,
    icon: '⚡',
    title: 'Functions & PL/pgSQL',
    tag: 'Level 9 · Programming',
    desc: 'Write stored functions with variables, conditionals, and loops.',
    xpReward: 100,
    steps: [

      {
        type: 'theory',
        title: 'SQL Functions',
        content: `
          <p class="theory-text">Postgres lets you write reusable functions in SQL or PL/pgSQL:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">SQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Simple SQL function</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">fn_add_ints</span>(int, int)
<span class="kw">RETURNS</span> int <span class="kw">AS</span>
$$
  <span class="kw">SELECT</span> $<span class="nm">1</span> + $<span class="nm">2</span>;  <span class="cm">-- $1 = 1st param, $2 = 2nd</span>
$$
<span class="kw">LANGUAGE</span> SQL;

<span class="fn">SELECT</span> fn_add_ints(<span class="nm">4</span>, <span class="nm">5</span>); <span class="cm">-- returns 9</span>

<span class="cm">-- Function with named parameters</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">fn_get_customers_by_state</span>(state_name <span class="tp">CHAR</span>(2))
<span class="kw">RETURNS</span> numeric <span class="kw">AS</span>
$$
  <span class="kw">SELECT</span> <span class="fn">COUNT</span>(*) <span class="kw">FROM</span> customer
  <span class="kw">WHERE</span> state = state_name;
$$
<span class="kw">LANGUAGE</span> SQL;

<span class="fn">SELECT</span> fn_get_customers_by_state(<span class="str">'TX'</span>);</pre>
          </div>
          <div class="info-box note">
            <span class="info-box-icon">💡</span>
            <div><strong>$$</strong> is called "dollar quoting" — it wraps the function body so you can use single quotes inside without escaping them.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'PL/pgSQL — Variables & Conditionals',
        content: `
          <p class="theory-text"><strong>PL/pgSQL</strong> is Postgres's procedural language. It adds variables, IF/ELSE, and loops:</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">PL/pgSQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">fn_check_month_orders</span>(the_month int)
<span class="kw">RETURNS</span> varchar <span class="kw">AS</span>
$$
  <span class="kw">DECLARE</span>
    total_orders int;
  <span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> <span class="fn">COUNT</span>(purchase_order_number)
    <span class="kw">INTO</span> total_orders
    <span class="kw">FROM</span> sales_order
    <span class="kw">WHERE</span> <span class="fn">EXTRACT</span>(<span class="tp">MONTH FROM</span> time_order_taken) = the_month;
    
    <span class="kw">IF</span> total_orders > <span class="nm">5</span> <span class="kw">THEN</span>
      <span class="kw">RETURN</span> <span class="fn">CONCAT</span>(total_orders, <span class="str">' Orders: Doing Good'</span>);
    <span class="kw">ELSEIF</span> total_orders < <span class="nm">5</span> <span class="kw">THEN</span>
      <span class="kw">RETURN</span> <span class="fn">CONCAT</span>(total_orders, <span class="str">' Orders: Doing Bad'</span>);
    <span class="kw">ELSE</span>
      <span class="kw">RETURN</span> <span class="fn">CONCAT</span>(total_orders, <span class="str">' Orders: On Target'</span>);
    <span class="kw">END IF</span>;
  <span class="kw">END</span>;
$$
<span class="kw">LANGUAGE</span> plpgsql;</pre>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'PL/pgSQL — Loops',
        content: `
          <div class="code-block">
            <div class="code-top"><span class="code-lang">PL/pgSQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- Basic LOOP with EXIT WHEN</span>
<span class="kw">LOOP</span>
  tot_sum := tot_sum + j;
  j := j + <span class="nm">1</span>;
  <span class="kw">EXIT WHEN</span> j > max_num;
<span class="kw">END LOOP</span>;

<span class="cm">-- FOR loop over a range (BY = step size)</span>
<span class="kw">FOR</span> i <span class="kw">IN</span> <span class="nm">1</span> .. max_num <span class="kw">BY</span> <span class="nm">2</span>
<span class="kw">LOOP</span>
  tot_sum := tot_sum + i;
<span class="kw">END LOOP</span>;

<span class="cm">-- FOR loop over query results</span>
<span class="kw">FOR</span> rec <span class="kw">IN</span>
  <span class="kw">SELECT</span> first_name, last_name <span class="kw">FROM</span> sales_person
<span class="kw">LOOP</span>
  <span class="kw">RAISE NOTICE</span> <span class="str">'%, %'</span>, rec.first_name, rec.last_name;
<span class="kw">END LOOP</span>;

<span class="cm">-- WHILE loop</span>
<span class="kw">WHILE</span> j <= <span class="nm">10</span>
<span class="kw">LOOP</span>
  tot_sum := tot_sum + j;
  j := j + <span class="nm">1</span>;
<span class="kw">END LOOP</span>;</pre>
          </div>
          <div class="info-box tip">
            <span class="info-box-icon">🔄</span>
            <div><em>RAISE NOTICE</em> is Postgres's way to print debug messages. They appear in the "Messages" panel of PGAdmin.</div>
          </div>
        `
      },

      {
        type: 'mcq',
        question: 'In PL/pgSQL, where do you declare variables?',
        options: [
          'Directly inside the BEGIN...END block',
          'In a DECLARE block, before BEGIN',
          'At the top of the SELECT statement',
          'Using CREATE VARIABLE'
        ],
        correct: 1,
        explanation: 'Variables are declared in the <strong>DECLARE</strong> block, which comes before <strong>BEGIN</strong>. Example: <em>DECLARE total int; BEGIN … END;</em>',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'What does "SELECT COUNT(*) INTO total_orders FROM …" do in PL/pgSQL?',
        options: [
          'Creates a new table called total_orders',
          'Runs the query and stores the result in the variable total_orders',
          'Exports the count to a file',
          'Selects data into a temporary buffer'
        ],
        correct: 1,
        explanation: '<strong>INTO variable_name</strong> stores the query result directly into a variable. This is how you capture query results for use in your function logic.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'What\'s the difference between a SQL function and a PL/pgSQL function?',
        options: [
          'SQL functions are faster; PL/pgSQL can\'t be used for production',
          'PL/pgSQL adds support for variables, IF/ELSE, loops — procedural logic',
          'SQL functions can use JOINs; PL/pgSQL cannot',
          'There is no real difference'
        ],
        correct: 1,
        explanation: '<strong>PL/pgSQL</strong> is a full procedural language with variables, conditionals (IF/ELSEIF/ELSE), loops (LOOP, FOR, WHILE), and RETURN QUERY. SQL functions are simpler — just a single SQL statement.',
        xp: 10
      },

      {
        type: 'fillblank',
        template: 'In PL/pgSQL, the block structure is: [BLANK] (vars) [BLANK] (code) [BLANK];',
        blanks: ['DECLARE', 'BEGIN', 'END'],
        xp: 15
      }
    ]
  },

  /* ════ LEVEL 9 ════ */
  {
    id: 9,
    icon: '🔔',
    title: 'Triggers & Stored Procedures',
    tag: 'Level 10 · Advanced',
    desc: 'Automate actions with triggers, and manage transactions with stored procedures.',
    xpReward: 120,
    steps: [

      {
        type: 'theory',
        title: 'Stored Procedures',
        content: `
          <p class="theory-text"><strong>Stored Procedures</strong> are like functions but can execute <em>transactions</em> (COMMIT/ROLLBACK) — functions can't. You call them with <em>CALL</em> not SELECT.</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">PL/pgSQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="kw">CREATE OR REPLACE PROCEDURE</span> <span class="fn">pr_debt_paid</span>(
  past_due_id int,
  payment numeric
)
<span class="kw">AS</span>
$$
<span class="kw">BEGIN</span>
  <span class="kw">UPDATE</span> past_due
  <span class="kw">SET</span> balance = balance - payment
  <span class="kw">WHERE</span> id = past_due_id;
  
  <span class="kw">COMMIT</span>;  <span class="cm">-- Saves the transaction</span>
<span class="kw">END</span>;
$$
<span class="kw">LANGUAGE</span> PLPGSQL;

<span class="cm">-- Call it:</span>
<span class="kw">CALL</span> <span class="fn">pr_debt_paid</span>(<span class="nm">1</span>, <span class="nm">10.00</span>);</pre>
          </div>
          <table class="type-table" style="margin-top:1rem">
            <tr><th></th><th>Function</th><th>Procedure</th></tr>
            <tr><td>Returns values</td><td>✅ Yes</td><td>⚠️ Only via INOUT</td></tr>
            <tr><td>Called with</td><td>SELECT fn()</td><td>CALL pr()</td></tr>
            <tr><td>Transactions</td><td>❌ No</td><td>✅ Yes (COMMIT/ROLLBACK)</td></tr>
          </table>
        `
      },

      {
        type: 'theory',
        title: 'Triggers',
        content: `
          <p class="theory-text"><strong>Triggers</strong> automatically execute a function when an event (INSERT, UPDATE, DELETE, TRUNCATE) happens on a table.</p>
          <div class="code-block">
            <div class="code-top"><span class="code-lang">PL/pgSQL</span><button class="code-copy" onclick="copyCode(this)">copy</button></div>
            <pre class="code-pre"><span class="cm">-- 1. Create the trigger FUNCTION</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">fn_log_dist_name_change</span>()
  <span class="kw">RETURNS TRIGGER</span>
  <span class="kw">LANGUAGE</span> PLPGSQL
<span class="kw">AS</span>
$$
<span class="kw">BEGIN</span>
  <span class="cm">-- NEW = new row data, OLD = previous row data</span>
  <span class="kw">IF</span> NEW.name <> OLD.name <span class="kw">THEN</span>
    <span class="kw">INSERT INTO</span> distributor_audit(dist_id, name, edit_date)
    <span class="kw">VALUES</span>(OLD.id, OLD.name, <span class="fn">NOW</span>());
  <span class="kw">END IF</span>;
  <span class="kw">RETURN NEW</span>;
<span class="kw">END</span>;
$$;

<span class="cm">-- 2. Bind function to a trigger on the table</span>
<span class="kw">CREATE TRIGGER</span> tr_dist_name_changed
  <span class="kw">BEFORE UPDATE ON</span> distributor
  <span class="kw">FOR EACH ROW</span>
  <span class="kw">EXECUTE PROCEDURE</span> <span class="fn">fn_log_dist_name_change</span>();</pre>
          </div>
          <div class="info-box note">
            <span class="info-box-icon">💡</span>
            <div>Inside trigger functions, <strong>NEW</strong> is the incoming new row data, and <strong>OLD</strong> is the previous row data. You can compare them to detect what changed.</div>
          </div>
        `
      },

      {
        type: 'theory',
        title: 'Trigger Timing & Variables',
        content: `
          <p class="theory-text">Triggers have built-in variables for context:</p>
          <table class="type-table">
            <tr><th>Variable</th><th>Contains</th></tr>
            <tr><td><span class="type-tag">TG_NAME</span></td><td>Name of the trigger</td></tr>
            <tr><td><span class="type-tag">TG_TABLE_NAME</span></td><td>Table the trigger fired on</td></tr>
            <tr><td><span class="type-tag">TG_OP</span></td><td>Operation: INSERT, UPDATE, DELETE, TRUNCATE</td></tr>
            <tr><td><span class="type-tag">TG_WHEN</span></td><td>BEFORE or AFTER</td></tr>
            <tr><td><span class="type-tag">TG_LEVEL</span></td><td>ROW or STATEMENT</td></tr>
          </table>
          <p class="theory-text" style="margin-top:1rem">Triggers can execute:</p>
          <ul style="margin:.5rem 0 0 1.2rem; line-height:2; font-size:.88rem; color:var(--text)">
            <li><strong>BEFORE</strong> the event — can modify or cancel the operation</li>
            <li><strong>AFTER</strong> the event — for logging/auditing</li>
            <li><strong>FOR EACH ROW</strong> — fires once per affected row</li>
            <li><strong>FOR EACH STATEMENT</strong> — fires once per SQL statement</li>
          </ul>
        `
      },

      {
        type: 'mcq',
        question: 'What is the key advantage of a Stored Procedure over a Function?',
        options: [
          'Procedures run faster than functions',
          'Procedures can handle transactions (COMMIT/ROLLBACK)',
          'Procedures can accept more parameters',
          'Procedures can be called with SELECT'
        ],
        correct: 1,
        explanation: 'The key difference: <strong>Stored Procedures can execute transactions</strong>. You can COMMIT or ROLLBACK changes within a procedure. Functions cannot manage transactions. Call procedures with CALL, not SELECT.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'Inside a trigger function, what does "OLD" represent?',
        options: [
          'The oldest row in the table',
          'The row data BEFORE the triggering operation',
          'The row that will be deleted',
          'The previous version of the trigger function'
        ],
        correct: 1,
        explanation: '<strong>OLD</strong> contains the row\'s data <em>before</em> the triggering event. <strong>NEW</strong> contains the incoming new data. This lets you compare values — e.g., detect if a name actually changed before logging it.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'A trigger runs "FOR EACH ROW". If an UPDATE affects 50 rows, how many times does the trigger function execute?',
        options: ['1 time', '50 times', '0 times — triggers need explicit calls', '2 times (BEFORE + AFTER)'],
        correct: 1,
        explanation: '<strong>FOR EACH ROW</strong> means the trigger fires once per affected row. If 50 rows are updated, the trigger function runs 50 times. <strong>FOR EACH STATEMENT</strong> would run just once regardless of rows affected.',
        xp: 10
      },

      {
        type: 'mcq',
        question: 'Which of these is a valid USE CASE for triggers?',
        options: [
          'Speeding up SELECT queries',
          'Auditing — automatically logging changes to a history table',
          'Replacing indexes for faster lookups',
          'Replacing views with physical tables'
        ],
        correct: 1,
        explanation: '<strong>Auditing / data logging</strong> is a classic trigger use case. When a row changes, the trigger automatically saves the old value + timestamp to an audit table. Other uses include data validation and maintaining cross-table integrity.',
        xp: 15
      }
    ]
  }

];

// ── BADGES DEFINITIONS ─────────────────────────
const BADGES_DEF = [
  { id: 'first_blood',  label: '🎯 First Blood',     cond: () => STATE.completedLevels.size >= 1 },
  { id: 'halfway',      label: '⚡ Halfway',          cond: () => STATE.completedLevels.size >= 5 },
  { id: 'xp100',        label: '💯 Century',          cond: () => STATE.xp >= 100 },
  { id: 'xp500',        label: '🏆 500 XP',           cond: () => STATE.xp >= 500 },
  { id: 'master',       label: '🧙 SQL Master',        cond: () => STATE.completedLevels.size >= 10 },
  { id: 'streak3',      label: '🔥 3 in a Row',        cond: () => STATE.completedLevels.size >= 3 },
];

// ── INIT ──────────────────────────────────────
function startGame() {
  document.getElementById('splash').style.animation = 'fadeUp .3s ease reverse forwards';
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    loadState();
    buildNav();
    openLevel(STATE.currentLevel);
  }, 300);
}

function loadState() {
  try {
    const saved = localStorage.getItem('pgquest');
    if (saved) {
      const s = JSON.parse(saved);
      STATE.xp = s.xp || 0;
      STATE.playerLevel = s.playerLevel || 1;
      STATE.currentLevel = s.currentLevel || 0;
      STATE.completedLevels = new Set(s.completedLevels || []);
      STATE.levelProgress = s.levelProgress || {};
      STATE.badges = s.badges || [];
    }
  } catch(e) {}
}

function saveState() {
  const s = {
    xp: STATE.xp,
    playerLevel: STATE.playerLevel,
    currentLevel: STATE.currentLevel,
    completedLevels: [...STATE.completedLevels],
    levelProgress: STATE.levelProgress,
    badges: STATE.badges
  };
  localStorage.setItem('pgquest', JSON.stringify(s));
}

function confirmReset() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    localStorage.removeItem('pgquest');
    location.reload();
  }
}

// ── NAV ───────────────────────────────────────
function buildNav() {
  const nav = document.getElementById('levelNav');
  nav.innerHTML = '';
  LEVELS.forEach((lvl, i) => {
    const locked = i > 0 && !STATE.completedLevels.has(i - 1);
    const done = STATE.completedLevels.has(i);
    const active = STATE.currentLevel === i;
    const prog = STATE.levelProgress[i] || { step: 0, score: 0 };
    const stars = done ? '★★★' : prog.step > 0 ? '★☆☆' : '☆☆☆';

    const div = document.createElement('div');
    div.className = `nav-item${locked?' locked':''}${done?' complete':''}${active?' active':''}`;
    div.innerHTML = `
      <div class="nav-icon">${locked ? '🔒' : lvl.icon}</div>
      <div class="nav-text">
        <div class="nav-title">${lvl.title}</div>
        <div class="nav-stars">${stars}</div>
      </div>
      <div class="nav-badge ${done?'done':'lock'}">${done?'✓':i+1}</div>
    `;
    if (!locked) div.onclick = () => openLevel(i);
    nav.appendChild(div);
  });

  updateXPBar();
  updateBadges();
}

function updateXPBar() {
  const xpThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300];
  const lvl = STATE.playerLevel;
  const xpStart = xpThresholds[lvl - 1] || 0;
  const xpEnd   = xpThresholds[lvl]     || 9999;
  const pct = Math.min(100, ((STATE.xp - xpStart) / (xpEnd - xpStart)) * 100);

  document.getElementById('xpCurrent').textContent = STATE.xp;
  document.getElementById('xpNext').textContent = xpEnd;
  document.getElementById('xpFill').style.width = pct + '%';
  document.getElementById('playerLvl').textContent = lvl;
}

function updateBadges() {
  BADGES_DEF.forEach(b => {
    if (!STATE.badges.includes(b.id) && b.cond()) {
      STATE.badges.push(b.id);
      showToast(`🏅 Badge unlocked: ${b.label}`);
    }
  });

  const row = document.getElementById('badgeRow');
  row.innerHTML = STATE.badges.map(id => {
    const b = BADGES_DEF.find(x => x.id === id);
    return b ? `<span class="badge">${b.label}</span>` : '';
  }).join('');
}

// ── OPEN LEVEL ────────────────────────────────
function openLevel(idx) {
  STATE.currentLevel = idx;
  saveState();
  buildNav();

  const lvl = LEVELS[idx];
  const prog = STATE.levelProgress[idx] || { step: 0, score: 0, done: false };
  const currentStep = prog.done ? 0 : prog.step;

  renderLesson(lvl, currentStep, prog);
}

function renderLesson(lvl, stepIdx, prog) {
  const panel = document.getElementById('mainPanel');
  const totalSteps = lvl.steps.length;
  const pct = Math.round((stepIdx / totalSteps) * 100);

  // Build steps indicator
  const stepsHTML = lvl.steps.map((s, i) => {
    let cls = 'step-dot';
    if (i < stepIdx) cls += ' done';
    else if (i === stepIdx) cls += ' active';
    return `<div class="${cls}" title="Step ${i+1}">${i < stepIdx ? '✓' : i+1}</div>`;
  }).join('');

  let stepHTML = '';
  if (stepIdx >= totalSteps) {
    // Show completion view
    stepHTML = buildCompletionView(lvl);
  } else {
    const step = lvl.steps[stepIdx];
    stepHTML = buildStep(step, stepIdx, lvl);
  }

  panel.innerHTML = `
    <div class="lesson-header">
      <div class="lesson-tag">${lvl.tag}</div>
      <h1 class="lesson-title">${lvl.icon} ${lvl.title}</h1>
      <p class="lesson-desc">${lvl.desc}</p>
    </div>
    <div class="lesson-progress">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${stepIdx}/${totalSteps} steps</div>
      <div class="xp-chip">+${lvl.xpReward} XP</div>
    </div>
    <div class="steps-row">${stepsHTML}</div>
    <div id="stepContent">${stepHTML}</div>
  `;
}

// ── BUILD STEP ────────────────────────────────
function buildStep(step, stepIdx, lvl) {
  if (step.type === 'theory') return buildTheory(step, stepIdx, lvl);
  if (step.type === 'mcq')    return buildMCQ(step, stepIdx, lvl);
  if (step.type === 'fillblank') return buildFillBlank(step, stepIdx, lvl);
  if (step.type === 'drag')   return buildDrag(step, stepIdx, lvl);
  if (step.type === 'code')   return buildCode(step, stepIdx, lvl);
  return '';
}

// ── THEORY ────────────────────────────────────
function buildTheory(step, stepIdx, lvl) {
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">📚</span>
        <span class="card-title">${step.title}</span>
      </div>
      <div class="card-body">${step.content}</div>
    </div>
    <div class="btn-group" style="margin-top:1.5rem">
      <button class="btn-primary" onclick="advanceStep(${lvl.id}, ${stepIdx})">
        Continue →
      </button>
      ${stepIdx > 0 ? `<button class="btn-secondary" onclick="goBack(${lvl.id}, ${stepIdx})">← Back</button>` : ''}
    </div>
  `;
}

// ── MCQ ───────────────────────────────────────
function buildMCQ(step, stepIdx, lvl) {
  const letters = ['A','B','C','D','E'];
  const opts = step.options.map((o, i) => `
    <div class="mcq-opt" id="opt_${i}" onclick="selectMCQ(${i}, ${step.correct}, '${escapeForAttr(step.explanation)}', ${step.xp}, ${lvl.id}, ${stepIdx})">
      <span class="opt-letter">${letters[i]}</span>
      <span>${o}</span>
    </div>
  `).join('');

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">❓</span>
        <span class="card-title">Knowledge Check</span>
        <span class="xp-chip">+${step.xp} XP</span>
      </div>
      <div class="card-body">
        <div class="quiz-q">
          <span class="q-num">Question</span>
          ${step.question}
        </div>
        <div class="mcq-options" id="mcqOptions">${opts}</div>
        <div id="mcqFeedback"></div>
      </div>
    </div>
    ${stepIdx > 0 ? `<div class="btn-group"><button class="btn-secondary" onclick="goBack(${lvl.id}, ${stepIdx})">← Back</button></div>` : ''}
  `;
}

function selectMCQ(chosen, correct, explanation, xp, lvlId, stepIdx) {
  const opts = document.querySelectorAll('.mcq-opt');
  opts.forEach(o => o.classList.add('disabled'));

  const isCorrect = chosen === correct;
  opts[chosen].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) opts[correct].classList.add('correct');

  const fb = document.getElementById('mcqFeedback');
  fb.innerHTML = `
    <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
      <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
      <div class="feedback-msg">
        <strong>${isCorrect ? 'Correct! +' + xp + ' XP' : 'Not quite!'}</strong>
        ${explanation}
      </div>
    </div>
    <div class="btn-group" style="margin-top:1rem">
      <button class="btn-primary" onclick="advanceStep(${lvlId}, ${stepIdx}${isCorrect ? ', ' + xp : ''})">
        ${isCorrect ? 'Next →' : 'Continue →'}
      </button>
    </div>
  `;

  if (isCorrect) awardXP(xp);
}

// ── FILL IN THE BLANK ─────────────────────────
function buildFillBlank(step, stepIdx, lvl) {
  const answers = step.blanks;
  let i = 0;
  const template = step.template.replace(/\[BLANK\]/g, () => {
    const idx = i++;
    return `<input class="blank-input" id="blank_${idx}" placeholder="___" data-answer="${answers[idx]}" autocomplete="off" spellcheck="false">`;
  });

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">✏️</span>
        <span class="card-title">Fill in the Blanks</span>
        <span class="xp-chip">+${step.xp} XP</span>
      </div>
      <div class="card-body">
        <div class="quiz-q"><span class="q-num">Complete the statement</span></div>
        <div class="blank-text">${template}</div>
        <div id="blankFeedback"></div>
        <div class="btn-group">
          <button class="btn-primary" onclick="checkBlanks(${step.xp}, ${lvl.id}, ${stepIdx})">Check →</button>
          ${stepIdx > 0 ? `<button class="btn-secondary" onclick="goBack(${lvl.id}, ${stepIdx})">← Back</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function checkBlanks(xp, lvlId, stepIdx) {
  const inputs = document.querySelectorAll('.blank-input');
  let allCorrect = true;
  inputs.forEach(inp => {
    const correct = inp.dataset.answer.toLowerCase().trim();
    const given = inp.value.toLowerCase().trim();
    if (given === correct) {
      inp.classList.add('correct-blank');
      inp.classList.remove('wrong-blank');
    } else {
      inp.classList.add('wrong-blank');
      inp.classList.remove('correct-blank');
      allCorrect = false;
    }
    inp.disabled = true;
  });

  const fb = document.getElementById('blankFeedback');
  fb.innerHTML = `
    <div class="feedback ${allCorrect ? 'correct' : 'wrong'}">
      <span class="feedback-icon">${allCorrect ? '✅' : '❌'}</span>
      <div class="feedback-msg">
        <strong>${allCorrect ? 'Perfect! +' + xp + ' XP' : 'Some blanks are wrong — check the highlighted ones.'}</strong>
        ${!allCorrect ? 'The correct answers are shown. Try remembering them!' : ''}
      </div>
    </div>
    <div class="btn-group" style="margin-top:1rem">
      <button class="btn-primary" onclick="advanceStep(${lvlId}, ${stepIdx}${allCorrect ? ', ' + xp : ''})">
        ${allCorrect ? 'Next →' : 'Continue →'}
      </button>
    </div>
  `;

  if (!allCorrect) {
    inputs.forEach(inp => {
      if (inp.classList.contains('wrong-blank')) {
        inp.value = inp.dataset.answer;
        inp.classList.remove('wrong-blank');
        inp.classList.add('correct-blank');
      }
    });
  }

  if (allCorrect) awardXP(xp);
}

// ── DRAG AND DROP ─────────────────────────────
function buildDrag(step, stepIdx, lvl) {
  let dropIdx = 0;
  const template = step.template.replace(/\[BLANK\]/g, () => {
    const i = dropIdx++;
    return `<span class="drop-zone" id="drop_${i}" data-idx="${i}" 
      ondragover="event.preventDefault(); this.classList.add('drag-over')"
      ondragleave="this.classList.remove('drag-over')"
      ondrop="dropToken(event, ${i})">drop here</span>`;
  });

  const shuffled = [...step.tokens].sort(() => Math.random() - .5);
  const tokens = shuffled.map((t, i) =>
    `<div class="drag-token" id="token_${i}" draggable="true" 
       ondragstart="dragStart(event, '${t}', 'token_${i}')">${t}</div>`
  ).join('');

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">🧩</span>
        <span class="card-title">Drag & Drop</span>
        <span class="xp-chip">+${step.xp} XP</span>
      </div>
      <div class="card-body">
        <div class="quiz-q"><span class="q-num">${step.question}</span></div>
        <div class="drag-challenge">
          <div class="drag-slots">${template}</div>
          <div class="drag-tokens" id="tokenPool">${tokens}</div>
        </div>
        <div id="dragFeedback"></div>
        <div class="btn-group">
          <button class="btn-primary" onclick="checkDrag(${JSON.stringify(step.answers).replace(/"/g,"'")}, ${step.xp}, ${lvl.id}, ${stepIdx})">Check →</button>
          ${stepIdx > 0 ? `<button class="btn-secondary" onclick="goBack(${lvl.id}, ${stepIdx})">← Back</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

let _dragToken = null;
let _dragTokenId = null;

function dragStart(e, token, id) {
  _dragToken = token;
  _dragTokenId = id;
  document.getElementById(id).classList.add('dragging');
}

function dropToken(e, zoneIdx) {
  e.preventDefault();
  const zone = document.getElementById(`drop_${zoneIdx}`);
  zone.classList.remove('drag-over');
  zone.textContent = _dragToken;
  zone.dataset.value = _dragToken;
  zone.classList.add('filled');

  if (_dragTokenId) {
    document.getElementById(_dragTokenId).classList.add('used');
  }
  _dragToken = null;
  _dragTokenId = null;
}

function checkDrag(answersStr, xp, lvlId, stepIdx) {
  const answers = answersStr.split ? answersStr.split(',').map(a => a.trim().replace(/'/g,'')) : answersStr;
  const zones = document.querySelectorAll('.drop-zone');
  let allCorrect = true;

  zones.forEach((z, i) => {
    const given = (z.dataset.value || '').trim();
    const correct = (answers[i] || '').trim();
    if (given.toLowerCase() === correct.toLowerCase()) {
      z.classList.add('correct-drop');
    } else {
      z.classList.add('wrong-drop');
      allCorrect = false;
    }
  });

  const fb = document.getElementById('dragFeedback');
  fb.innerHTML = `
    <div class="feedback ${allCorrect ? 'correct' : 'wrong'}">
      <span class="feedback-icon">${allCorrect ? '✅' : '❌'}</span>
      <div class="feedback-msg">
        <strong>${allCorrect ? 'Spot on! +' + xp + ' XP' : 'Not quite! The correct order is: ' + answers.join(' → ')}</strong>
      </div>
    </div>
    <div class="btn-group" style="margin-top:1rem">
      <button class="btn-primary" onclick="advanceStep(${lvlId}, ${stepIdx}${allCorrect ? ', ' + xp : ''})">
        ${allCorrect ? 'Next →' : 'Continue →'}
      </button>
    </div>
  `;

  if (allCorrect) awardXP(xp);
}

// ── CODE CHALLENGE ────────────────────────────
// Store current code step data here to avoid passing complex objects through onclick attrs
let _currentCodeStep = {};

function buildCode(step, stepIdx, lvl) {
  // Save step data to a plain object — no HTML attribute serialization needed
  _currentCodeStep = {
    answer:    step.answer,
    answerAlt: step.answerAlt || [],
    hint:      step.hint || '',
    xp:        step.xp,
    lvlId:     lvl.id,
    stepIdx:   stepIdx
  };

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">💻</span>
        <span class="card-title">Code Challenge</span>
        <span class="xp-chip">+${step.xp} XP</span>
      </div>
      <div class="card-body">
        <div class="quiz-q"><span class="q-num">Write SQL</span></div>
        <div class="challenge-prompt">${step.prompt}</div>
        <div class="code-editor-wrap">
          <div class="editor-bar">
            <div class="editor-dot"></div><div class="editor-dot"></div><div class="editor-dot"></div>
            <span class="editor-label">SQL Editor</span>
          </div>
          <textarea class="code-textarea" id="codeInput" rows="5" placeholder="-- Write your SQL here..."></textarea>
        </div>
        <div id="codeFeedback"></div>
        <div class="btn-group">
          <button class="btn-primary" onclick="checkCode()">Run →</button>
          ${stepIdx > 0 ? `<button class="btn-secondary" onclick="goBack(${lvl.id}, ${stepIdx})">← Back</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function checkCode() {
  const { answer, answerAlt, hint, xp, lvlId, stepIdx } = _currentCodeStep;
  const given = (document.getElementById('codeInput').value || '').toLowerCase().trim();

  if (!given) {
    document.getElementById('codeFeedback').innerHTML = `
      <div class="feedback wrong">
        <span class="feedback-icon">✏️</span>
        <div class="feedback-msg"><strong>Please write some SQL first!</strong></div>
      </div>`;
    return;
  }

  // Check 1: must contain the primary required keyword/phrase
  const primaryMatch = given.includes(answer.toLowerCase());

  // Check 2: must contain ALL of the alt keywords (proves it's a real attempt)
  const altMatch = answerAlt.length > 0 && answerAlt.every(a => given.includes(a.toLowerCase()));

  const isCorrect = primaryMatch || altMatch;

  const fb = document.getElementById('codeFeedback');
  fb.innerHTML = `
    <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
      <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
      <div class="feedback-msg">
        <strong>${isCorrect ? 'Great SQL! +' + xp + ' XP' : 'Not quite!'}</strong>
        ${!isCorrect && hint ? `<span style="display:block;margin-top:.3rem;font-family:var(--mono);font-size:.78rem;opacity:.8">${hint}</span>` : ''}
      </div>
    </div>
    <div class="btn-group" style="margin-top:1rem">
      <button class="btn-primary" onclick="advanceStep(${lvlId}, ${stepIdx}${isCorrect ? ', ' + xp : ''})">
        ${isCorrect ? 'Next →' : 'Try Again →'}
      </button>
    </div>
  `;

  if (isCorrect) awardXP(xp);
}

// ── COMPLETION VIEW ───────────────────────────
function buildCompletionView(lvl) {
  const prog = STATE.levelProgress[lvl.id] || {};
  return `
    <div class="card" style="border-color:rgba(57,231,95,.25); text-align:center;">
      <div class="card-body" style="padding:2.5rem">
        <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
        <div style="font-size:1.5rem;font-weight:800;color:var(--white);margin-bottom:.5rem">Level Complete!</div>
        <div style="color:var(--text2);margin-bottom:1.5rem">You've mastered: ${lvl.title}</div>
        <div style="display:flex;justify-content:center;gap:2rem;margin-bottom:2rem">
          <div><div style="font-size:1.8rem;font-weight:800;color:var(--amber)">+${lvl.xpReward}</div><div style="font-size:.75rem;font-family:var(--mono);color:var(--text2)">XP EARNED</div></div>
          <div><div style="font-size:1.8rem;font-weight:800;color:var(--green)">★★★</div><div style="font-size:.75rem;font-family:var(--mono);color:var(--text2)">RATING</div></div>
        </div>
        ${getNextLevelButton(lvl.id)}
      </div>
    </div>
  `;
}

function getNextLevelButton(lvlId) {
  const next = LEVELS[lvlId + 1];
  if (next) {
    return `<button class="btn-primary" onclick="openLevel(${lvlId + 1})">Next: ${next.icon} ${next.title} →</button>`;
  }
  return `<div style="color:var(--cyan);font-weight:700;font-size:1.1rem">🏆 You've completed all levels!</div>`;
}

// ── NAVIGATION ────────────────────────────────
function advanceStep(lvlId, stepIdx, xpGained) {
  const lvl = LEVELS[lvlId];
  const nextStep = stepIdx + 1;

  if (!STATE.levelProgress[lvlId]) STATE.levelProgress[lvlId] = { step: 0, score: 0 };
  STATE.levelProgress[lvlId].step = nextStep;

  if (nextStep >= lvl.steps.length) {
    // Level complete
    if (!STATE.completedLevels.has(lvlId)) {
      STATE.completedLevels.add(lvlId);
      awardXP(lvl.xpReward);
      STATE.levelProgress[lvlId].done = true;
      showLevelCompleteModal(lvl);
    }
  }

  saveState();
  openLevel(lvlId);
}

function goBack(lvlId, stepIdx) {
  const prog = STATE.levelProgress[lvlId] || { step: 0 };
  STATE.levelProgress[lvlId] = { ...prog, step: Math.max(0, stepIdx - 1) };
  saveState();
  openLevel(lvlId);
}

// ── XP & LEVELING ─────────────────────────────
function awardXP(amount) {
  STATE.xp += amount;
  // Level up check
  const xpThresholds = [100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300];
  for (let i = 0; i < xpThresholds.length; i++) {
    if (STATE.xp >= xpThresholds[i] && STATE.playerLevel <= i) {
      STATE.playerLevel = i + 2;
      showToast(`⬆️ Level Up! You're now Level ${STATE.playerLevel}!`);
    }
  }
  updateXPBar();
  updateBadges();
  saveState();
}

// ── LEVEL COMPLETE MODAL ──────────────────────
function showLevelCompleteModal(lvl) {
  const modal = document.getElementById('modal');
  const box = document.getElementById('modalBox');

  const nextLvl = LEVELS[lvl.id + 1];

  box.innerHTML = `
    <span class="modal-emoji">🏆</span>
    <div class="modal-title">Level Complete!</div>
    <div class="modal-sub">${lvl.title} — mastered!</div>
    <div class="modal-stats">
      <div>
        <div class="modal-stat-n">+${lvl.xpReward}</div>
        <div class="modal-stat-l">XP Earned</div>
      </div>
      <div>
        <div class="modal-stat-n">${STATE.completedLevels.size}</div>
        <div class="modal-stat-l">/ 10 Levels</div>
      </div>
    </div>
    ${nextLvl ? `
      <div style="margin-bottom:1rem;color:var(--text2);font-size:.88rem">Next up: ${nextLvl.icon} <strong style="color:var(--white)">${nextLvl.title}</strong></div>
    ` : ''}
    <div class="btn-group" style="justify-content:center">
      ${nextLvl ? `<button class="btn-primary" onclick="closeModal(); openLevel(${lvl.id + 1})">Start Next Level →</button>` : '<button class="btn-primary" onclick="closeModal()">🎉 Finish!</button>'}
      <button class="btn-secondary" onclick="closeModal()">Stay Here</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3200);
}

// ── CODE COPY ─────────────────────────────────
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('.code-pre');
  const text = pre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'copied!';
    btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 1500);
  });
}

// ── HELPERS ───────────────────────────────────
function escapeForAttr(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');
}
