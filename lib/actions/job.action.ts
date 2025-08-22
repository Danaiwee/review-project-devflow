"use server";

export async function fetchJobs(
  filters: JobFilterParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const { query, page, location = "us" } = filters;

  const url = `https://jsearch.p.rapidapi.com/search?query=developer%20${query}&page=${page}&num_pages=1&country=${location}&date_posted=all`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jobsData = (result.data || []).map((item: any) => ({
      id: item.job_id,
      employer_name: item.employer_name || "",
      employer_logo: item.employer_logo || "",
      employer_website: item.employer_website || "",
      job_employment_type: item.job_employment_type || "",
      job_title: item.job_title || "",
      job_description: item.job_description || "",
      job_apply_link: item.job_apply_link || "",
      job_city: item.job_city || "",
      job_state: item.job_state || "",
      job_country: item.job_country || "",
    }));

    return { success: true, data: jobsData };
  } catch (error) {
    console.log(error);
  }
}
