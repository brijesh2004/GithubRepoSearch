import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

interface DataType {
  user: string;
  avatar: string;
  description: string;
  github_url: string;
  star: number;
  language: string;
  createdAt: string;
  updatedAt: string;
}

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const Details = ({ route }: { route: DetailsScreenRouteProp }) => {
  const { id } = route.params;
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/repositories/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData({
          user: result.owner.login,
          avatar: result.owner.avatar_url,
          description: result.description || "No description available",
          github_url: result.html_url,
          star: result.stargazers_count,
          language: result.language || "Not specified",
          createdAt: result.created_at,
          updatedAt: result.updated_at,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repository Details</Text>
      <View style={styles.headerContainer}>
        <Image source={{ uri: data?.avatar }} style={styles.avatarImage} />
        <Text style={styles.userName}>{data?.user}</Text>
      </View>

      <Text style={styles.description}>{data?.description}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Language: {data?.language}</Text>
        <Text style={styles.detailText}>Stars: {data?.star}</Text>
        <Text style={styles.detailText}>Created: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}</Text>
        <Text style={styles.detailText}>Updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A'}</Text>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => data?.github_url && Linking.openURL(data.github_url)}>
        <Text style={styles.linkButtonText}>View on GitHub</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: '50%',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: '50%',
  },
  linkButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
