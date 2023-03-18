const fetchData = async (
  method: string,
  url: string,
  data?: Record<string, any>,
  token = localStorage.getItem("token")
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status > 299) {
    throw new Error();
  }

  try {
    return await response.json();
  } catch {
    return response;
  }
};

export default fetchData;
