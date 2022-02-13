import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pagination, Table } from "rsuite";
import { useAuthContext } from "../../providers/AuthProvider";

const Users = props => {
    const [{ accessToken }] = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);

    const [sortCol, setSortCol] = useState();
    const [sortType, setSortType] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState();

    const getUsers = () => {
        setIsLoading(true);
        setError(false);
        console.log(accessToken);
        axios.get("/api/Users/AllUsers", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setUsers(response.data);
                setError(false);
                console.log(response);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const dataToTable = () => {
        
        if (sortCol && sortType) {
            return users.sort((a, b) => {
                let x = a[sortCol];
                let y = b[sortCol];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortType === 'asc') {
                    return x - y;
                }
                else {
                    return y - x;
                }
            });
        }
        return users;
    }
    const handleSortColumn = (sortCol, sortType) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSortCol(sortCol);
            setSortType(sortType);
        }, 500)
    }
    useEffect(() => {
        getUsers();
    }, [accessToken, sortCol, sortType])



    return (
        <div>
            <Table
                data={dataToTable()}
                onSortColumn={handleSortColumn}
                sortType={sortType}
                sortColumn={sortCol}
                loading={isLoading}
                autoHeight={true}
                bordered
                cellBordered
                wordWrap >
                <Table.Column sortable resizable fixed width={100} >
                    <Table.HeaderCell align="center" >Jméno</Table.HeaderCell>
                    <Table.Cell dataKey="firstName" />
                </Table.Column>
                <Table.Column sortable resizable fixed width={100} >
                    <Table.HeaderCell align="center">Příjmení</Table.HeaderCell>
                    <Table.Cell dataKey="lastName" />
                </Table.Column>
                <Table.Column resizable width={60} >
                    <Table.HeaderCell align="center">Pohlaví</Table.HeaderCell>
                    <GenderCell dataKey={"gender"} />
                </Table.Column>
                <Table.Column sortable resizable width={200}  >
                    <Table.HeaderCell align="center">Email</Table.HeaderCell>
                    <Table.Cell dataKey="email" />
                </Table.Column>
                <Table.Column resizable width={110} >
                    <Table.HeaderCell align="center">Potvrzený email</Table.HeaderCell>
                    <YesNoCell dataKey={"emailConfirmed"} />
                </Table.Column>
                <Table.Column resizable width={140} >
                    <Table.HeaderCell align="center">Potencionální student</Table.HeaderCell>
                    <YesNoCell dataKey={"potentionalStudent"} />
                </Table.Column>
                <Table.Column sortable resizable width={200} >
                    <Table.HeaderCell align="center">Škola</Table.HeaderCell>
                    <Table.Cell dataKey="school" />
                </Table.Column>
                <Table.Column resizable width={90} >
                    <Table.HeaderCell align="center">Stav</Table.HeaderCell>
                    <ConditionCell dataKey={"condition"} />
                </Table.Column>
                <Table.Column sortable resizable width={80} autoHeight >
                    <Table.HeaderCell align="center">Ročník</Table.HeaderCell>
                    <YearCell dataKey={"year"} />
                </Table.Column>
            </Table>
        </div>
    )
}

const YesNoCell = ({rowData, dataKey, ...props}) => {
    return(
        <Table.Cell {...props}>
            {rowData[dataKey] ? "Ano" : "Ne"}
        </Table.Cell>
    )
}
const GenderCell = ({rowData, dataKey, ...props}) => {
    return(
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "Muž" : rowData[dataKey] === 1 ? "Žena" : "Jiné" }
        </Table.Cell>
    )
}
const ConditionCell = ({rowData, dataKey, ...props})=>{
    return(
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "Aktivní" : "Blokovaný"}
        </Table.Cell>
    )
}
const YearCell = ({rowData, dataKey, ...props}) => {
    return(
        <Table.Cell {...props}>
            {rowData[dataKey] === 0 ? "1. - 7." : rowData[dataKey] === 1 ? "8." : rowData[dataKey] === 2 ? "9." : "SŠ" }
        </Table.Cell>
    )
}

export default Users;