import Search from "../../components/search/Search"
import "./home.css"
export const Home = () => {
  return (
    <div className='homeContainer'>
        <div className="searchContainer">
        <p className="mainText">Find The </p>
        <p className="mainText"> Hidden Places</p>
        <p className="smallText">go outside and find the hidden place and beautifull place</p>
        <Search/>
        </div>
    </div>
  )
}
