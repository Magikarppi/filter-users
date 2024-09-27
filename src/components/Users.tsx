import { useQuery } from "@tanstack/react-query";
import styles from "./Users.module.css";
import { API_URL_USERS } from "../consts";
import { useState } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

const Users = () => {
    const [filter, setFilter] = useState<string>("");
    const [sortCriteria, setSortCriteria] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const { isPending, error, data, isFetching } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch(API_URL_USERS);
            return await response.json();
        },
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortCriteria(event.target.value);
    };

    const handleSortOrderToggle = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const filteredUsers = data?.filter((user: User) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
    );

    const sortedUsers = filteredUsers?.sort((a, b) => {
        const compare =
            sortCriteria === "name"
                ? a.name.localeCompare(b.name)
                : a.email.localeCompare(b.email);
        return sortOrder === "asc" ? compare : -compare;
    });

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={styles.users}>
            <h1>Users</h1>
            <div className={styles.inputGroup}>
                <label htmlFor="filter">Filter by name</label>
                <input
                    id="filter"
                    type="text"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <select value={sortCriteria} onChange={handleSortChange}>
                    <option value="name">Sort by name</option>
                    <option value="email">Sort by email</option>
                </select>
                <button onClick={handleSortOrderToggle}>
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
            </div>
            {sortedUsers?.map((user: User) => (
                <div className={styles.card} key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                    <p>{user.website}</p>
                    <p>
                        {user.address.street} - {user.address.city}
                    </p>
                </div>
            ))}
            <div>{isFetching ? "Updating..." : ""}</div>
        </div>
    );
};

export default Users;
