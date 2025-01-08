import { useEffect, useState } from 'react';

interface UseFetchProps {
  query: string;
  page:number;
}

interface FetchedData {
  id: string;
  name: string;
  description: string;
  language:string;
  forks:number;
  username:string;
  avatar_url:string;
}

const useFetch = ({ query , page }: UseFetchProps) => {
  const [data, setData] = useState<FetchedData| null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&page=${page}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        
          
        setData(json.items.map((item:any)=> ({
          id: item.id,
          name: item.name,
          description: item.description,
          language: item.language,
          forks: item.forks,
          username: item.owner.login,
          avatar_url: item.owner.avatar_url, 
      })));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query , page]);

  return { data, loading, error };
};

export default useFetch;
