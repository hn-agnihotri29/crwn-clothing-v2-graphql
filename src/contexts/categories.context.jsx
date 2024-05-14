import { createContext, useState, useEffect } from 'react';

//gql help to write same query like in graphql playground
import { gql, useQuery } from '@apollo/client';


export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
  query{
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`

export const CategoriesProvider = ({ children }) => {
   const { loading, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});
  useEffect(() => {

    //on initialization our data come to be undefined
    if(data) {
      const {collections} = data;
      const collectionMap = collections.reduce((acc, collection) => {
        const { title, items } = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      }, {})

      setCategoriesMap(collectionMap);
    }
  }, [data])

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
