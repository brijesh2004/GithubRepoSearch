import { Button, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from '../customHook/useFetch';
import CheckBox from 'react-native-check-box';

interface QueryProps {
  query: string;
  navigation: any;
}

const Repos: React.FC<QueryProps> = ({ query, navigation }) => {
  const [page, setPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<{ id: number; name: string; description: string }[]>([]);


  const { data, loading, error } = useFetch({ query, page });

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
  
    loadFavorites();
  }, []);
  

  const toggleFavorite = async (item: { id: number; name: string; description: string }) => {
    try {
      const isFavorite = favorites.some((fav) => fav.id === item.id);

      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = favorites.filter((fav) => fav.id !== item.id);
      } else {
        updatedFavorites = [...favorites, { id: item.id, name: item.name, description: item.description }];
      }

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const repos = Array.isArray(data) ? data : [];

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const HandlePress = (id: number) => {
    navigation.navigate('Details', { id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Repositories for "{query}":</Text>

      <View style={styles.buttonContainer}>
        <Button title="Prev" onPress={handlePrevPage} disabled={page === 1} color="#007bff" />
        <Button title="Next" onPress={handleNextPage} color="#007bff" />
      </View>

      <FlatList
        data={repos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => HandlePress(item.id)}>
            <View style={styles.repoCard} key={item.id}>
              <View style={styles.repoDetails}>
                <Text style={styles.repoName}>{item.name}</Text>
                <Text style={styles.repoDescription}>
                  {item.description ? item.description.slice(0, 40) + '...' : 'No description available.'}
                </Text>
                <Text style={styles.repoLanguage}>Language: {item.language}</Text>
                <Text style={styles.repoForks}>Forks: {item.forks}</Text>
                <Text style={styles.repoUsername}>User: {item.username}</Text>
              </View>
              <View>
                <Image source={{ uri: item.avatar_url }} style={styles.avatarImage} />
                <CheckBox
                  rightText="Fav"
                  style={{ flex: 1 }}
                  onClick={() => toggleFavorite({ id: item.id, name: item.name, description: item.description })}
                  isChecked={favorites.some((fav) => fav.id === item.id)}
                />

              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default Repos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  repoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoDetails: {
    flex: 1,
    marginRight: 16,
  },
  repoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  repoDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
  },
  repoLanguage: {
    fontSize: 14,
    color: '#007bff',
  },
  repoForks: {
    fontSize: 14,
    color: '#888',
  },
  repoUsername: {
    fontSize: 14,
    color: '#555',
  },
  avatarImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});