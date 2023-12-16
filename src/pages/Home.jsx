import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setCategoryId } from '../redux/slices/filterSlices';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

const Home = () => {
  const dispatch = useDispatch();
  const { categoryId, sort } = useSelector((state) => state.filter);

  const { searchValue } = useContext(SearchContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  // useEffect()
  useEffect(() => {
    setIsLoading(true);
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'ask' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    // fetch(
    //   `https://6574c5a3b2fbb8f6509ca5cb.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
    // )
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setItems(data);
    //     setIsLoading(false);
    //   });

    axios
      .get(
        `https://6574c5a3b2fbb8f6509ca5cb.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // ==========================================================
  // Search for static
  // const pizzas = items
  // .filter((obj) => {
  //   if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
  //     return true;
  //   }

  //   return false;
  // })
  // .map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  // ==========================================================

  const pizzas = items.map((pizza) => <PizzaBlock key={pizza.id} {...pizza} />);

  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {/* {items.map((pizza) => {
              return <PizzaBlock key={pizza.id} {...pizza} />;
            })} */}
        {isLoading ? skeletons : pizzas}
      </div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};

export default Home;
