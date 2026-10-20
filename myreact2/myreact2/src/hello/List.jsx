
function List()
{

    // const fruits=["apple","bamana","papaya","pineapple"];

    const fruits=[{id:1, item:"apple",calori:50},
        {id:2, item:"banana" ,calori:30},
        {id:3, item:"papaya",calori:80},
        {id:4, item:"pineapple",calori:100},
        {id:5, item:"ant", calori:1000}];
        fruits.sort((a,b) => a.item.localeCompare(b.item));
    const listitems=fruits.map(fruit => <li key={fruit.id}>
        {fruit.item}:&nbsp;
        <b>{fruit.calori}</b></li>)

    return(<ol>{listitems}</ol>);
}

export default List