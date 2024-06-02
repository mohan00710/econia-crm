import React, { useEffect, useState } from "react";
import "./App.css";
import { getUserOrderInfo, OrderDetails } from "./methods/order";
import { convertToIst } from "./methods/utils";

interface OrderDetailsProps {
  order: OrderDetails;
}

const OrderDetailsComponent: React.FC<OrderDetailsProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="order-item">
      <div className="order-summary" onClick={toggleExpand}>
        <h3>Order ID: {order.order_id}</h3>
        <p>Market ID: {order.market_id}</p>
        <p>Created At: {convertToIst(order.created_at)}</p>
        <p>Last Updated At: {convertToIst(order.last_updated_at)}</p>
      </div>
      {isExpanded && (
        <div className="order-details">
          <p>Integrator: {order.integrator}</p>
          <p>Total Filled: {order.total_filled}</p>
          <p>Remaining Size: {order.remaining_size}</p>
          <p>Order Status: {order.order_status}</p>
          <p>Order Type: {order.order_type}</p>
          <p>User: {order.user}</p>
          <p>Direction: {order.direction}</p>
          <p>Price: {order.price}</p>
          <p>Custodian ID: {order.custodian_id}</p>
          <p>Self Matching Behavior: {order.self_matching_behavior}</p>
          <p>Restriction: {order.restriction}</p>
          <p>Min Base: {order.min_base ?? "N/A"}</p>
          <p>Max Base: {order.max_base ?? "N/A"}</p>
          <p>Min Quote: {order.min_quote ?? "N/A"}</p>
          <p>Max Quote: {order.max_quote ?? "N/A"}</p>
          <p>Average Execution Price: {order.average_execution_price}</p>
        </div>
      )}
    </div>
  );
};

function App() {
  const [data, setData] = useState<OrderDetails[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [marketId, setMarketId] = useState(7);
  const [pageSize, setPageSize] = useState(30);
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchData(userId, marketId, pageNumber, pageSize, sortOrder)
        .then((data) => {
          setData(data);
          setTotalPages(Math.ceil(1000 / pageSize)); // assuming data.total gives the total number of records
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    }
  }, [userId, marketId, pageNumber, pageSize, sortOrder]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setPageNumber(0); // Reset to first page on new search
    fetchData(userId, marketId, 0, pageSize, sortOrder)
      .then((data) => {
        setData(data);
        setTotalPages(Math.ceil(1000 / pageSize)); // assuming data.total gives the total number of records
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="input-form">
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </label>
        <label>
          Market ID:
          <input
            type="number"
            value={marketId}
            onChange={(e) => setMarketId(Number(e.target.value))}
          />
        </label>
        <label>
          Page Size:
          <input
            type="number"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          />
        </label>
        <label>
          Sort Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <button type="submit">Fetch Orders</button>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : data && data.length > 0 ? (
        <div className="orders-container">
          {data.map((order) => (
            <OrderDetailsComponent key={order.order_id} order={order} />
          ))}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={pageNumber === 0}>
              Previous
            </button>
            <span>
              Page {pageNumber + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageNumber === totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}

async function fetchData(
  userId: string,
  marketId: number,
  pageNumber: number,
  pageSize: number,
  sortOrder: string
) {
  const offset = pageNumber * pageSize;
  const data = await getUserOrderInfo(
    userId,
    marketId,
    offset,
    pageSize,
  );
  return data;
}

export default App;
