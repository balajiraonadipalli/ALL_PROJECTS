import { useNavigate } from "react-router-dom";

const laptops = [
    {
      id: 1,
      brand: "Apple",
      model: "MacBook Pro 16",
      processor: "Apple M2 Pro",
      ram: "16GB",
      storage: "512GB SSD",
      price: 2499,
      rating: 4.8,
      url:"https://imgs.search.brave.com/0aGsd08JSGPmBCclY-mbmK4tW1It9tW4rIqngBOHn7E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGF0/Zm9ybS50aGV2ZXJn/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/L3NpdGVzLzIvY2hv/cnVzL3VwbG9hZHMv/Y2hvcnVzX2Fzc2V0/L2ZpbGUvMTkzOTUx/ODUvdnBhdmljXzE5/MTExOF8zODAwXzAw/NTguanBnP3F1YWxp/dHk9OTAmc3RyaXA9/YWxsJmNyb3A9MCww/LDEwMCwxMDAmdz0y/NDAw"
    },
    {
      id: 2,
      brand: "Dell",
      model: "XPS 15",
      processor: "Intel Core i7-13700H",
      ram: "16GB",
      storage: "1TB SSD",
      price: 1899,
      rating: 4.7,
      url:'https://imgs.search.brave.com/wz4LTqQobLE1srTwhh8NhVNN2SldKu0LMpi7WXQMmS0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y25ldC5jb20vYS9p/bWcvcmVzaXplLzdm/MjMxNmY3YmI1NjZl/NzQ5YWUxZTA3Njlj/YzAwYTYxOTFmYmQ4/OTAvaHViLzIwMTYv/MDIvMDgvMzYyMDFm/NWEtODcxZC00MGYx/LWFlYjgtOTc1OWM0/NTdkMjI0L2RlbGwt/eHBzLTE1LTAxLmpw/Zz9hdXRvPXdlYnAm/d2lkdGg9MTIwMA'
    },
    {
      id: 3,
      brand: "HP",
      model: "Spectre x360",
      processor: "Intel Core i7-1260P",
      ram: "16GB",
      storage: "512GB SSD",
      price: 1599,
      rating: 4.6,
      url:'https://imgs.search.brave.com/rZ57CpE7nw_gUCRwuUdmYD7p8hBusuhPdxJQhJo-NNc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFLLVBqSjZsQ0wu/anBn'
    },
    {
      id: 4,
      brand: "Lenovo",
      model: "ThinkPad X1 Carbon",
      processor: "Intel Core i7-1280P",
      ram: "32GB",
      storage: "1TB SSD",
      price: 1999,
      rating: 4.8,
      url:'https://imgs.search.brave.com/L3zZu8UylFG3HF1HfgpPyX_mvt1vB-u_27H1qZyxa-I/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFxSEdyZE0ra0wu/anBn'
    },
    {
      id: 5,
      brand: "Asus",
      model: "ROG Zephyrus G14",
      processor: "AMD Ryzen 9 6900HS",
      ram: "16GB",
      storage: "1TB SSD",
      price: 1799,
      rating: 4.7,
      url:'https://imgs.search.brave.com/mZTAW_HArlJPajbnh4BMRmSHbrEo_-PXkPOqHYO9444/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBj/bWFnLmNvbS9pbWFn/ZXJ5L3Jldmlld3Mv/MDZuNm5kQUptdVV2/S1lMR3YxbmpjbjAt/MS5maXRfc2NhbGUu/c2l6ZV83NjB4NDI3/LnYxNzEwNTQwNjgx/LmpwZw'
    },
    {
      id: 6,
      brand: "Acer",
      model: "Predator Helios 300",
      processor: "Intel Core i7-12700H",
      ram: "16GB",
      storage: "1TB SSD",
      price: 1499,
      rating: 4.5,
      url:'https://imgs.search.brave.com/gS5GGOcQUrgdNJVmOi2HqIt9DxcLWIbeMCCAL_Br5e4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEv/dmMvNzc5ZWU3MmYt/ODcyZi00ZTZkLTk5/MWUtYThmZWI4MWVm/ZDk1Ll9fQ1IwLDAs/ODAwLDYwMF9QVDBf/U1g4MDBfVjFfX18u/anBn'
    },
    {
      id: 7,
      brand: "Microsoft",
      model: "Surface Laptop 5",
      processor: "Intel Core i7-1265U",
      ram: "16GB",
      storage: "512GB SSD",
      price: 1399,
      rating: 4.4,
      url:'https://imgs.search.brave.com/vzeXC51Lq__DXGI-WLS_lxfupHac-O4tYZ4cGS00jUk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzYxWHRRZmItc1JM/LmpwZw'
    },
  ];
  function Laptop(){
    const navigate = useNavigate();
    return(
        <>
        <div className = "productCards">
        {
            laptops.map((laptop,id)=>(
                
                    <div className="productCard" key={id}>
                    <h3>
                        {laptop.brand}
                    </h3>
                    <button onClick={() => navigate(`/Laptop/${laptop.brand}`, { state: { laptopName : laptop } })}>

                    view  Details
                    </button>
                </div>
               
  ))}
    </div>
        </>
    )
  }

  export default Laptop;