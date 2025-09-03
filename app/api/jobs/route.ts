import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'jobmanagement',
  password: 'postgres',
  port: 5433, // since you mentioned pgAdmin works only on 5433
});

// GET all jobs
export async function GET() {
  // Fetch jobs from your database
  const jobs = await pool.query('SELECT * FROM jobs ORDER BY "createdAt"');
  return NextResponse.json(jobs.rows);
}

// POST new job
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = `
  INSERT INTO jobs ("title", "company", "location", "type", "salaryRange", "salaryrange2", "description", "applicationDeadline", "isRemote")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`;

    const values = [
      body.title,
      body.company,
      body.location,
      body.type,
      body.salaryFrom,
      body.salaryTo,
      body.description,
      body.deadline,
      body.remote,
    ];
        console.log("Submitting job:", values);


    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
}
