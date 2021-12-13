import React, { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    Box,
    chakra,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    VStack,
    Heading,
    Text,
    HStack
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, useFilters } from 'react-table'
import ticketServices from '../../services/ticketServices';
import { Filter, DefaultColumnFilter } from './filter';

const TicketsPage = () => {
    // hooks for the modals
    const TicketStat = ({ heading, stat }) => {
        return (
            <VStack>
                <Heading fontSize={'2xl'} textAlign={'center'}>
                    {heading}
                </Heading>
                <Text>{stat}</Text>
            </VStack>
        )
    }

    const Details = (row) => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
            <>
                <Button onClick={onOpen}>Details</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <HStack>
                                <VStack>
                                    <TicketStat heading={'Name'} stat={row.row.name} />
                                    <TicketStat heading={'Id'} stat={row.row._id} />
                                    <TicketStat heading={'Description'} stat={row.row.description} />
                                    <TicketStat heading={'Submitter'} stat={row.row.submitter} />
                                </VStack>
                                <VStack>
                                    <TicketStat heading={'Assigned Dev'} stat={row.row.assigned_developer} />
                                    <TicketStat heading={'priority'} stat={row.row.priority} />
                                    <TicketStat heading={'status'} stat={row.row.status} />
                                    <TicketStat heading={'type'} stat={row.row.type} />
                                </VStack>
                            </HStack>

                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }

    // hook for getting tickets from the backend
    const [tickets, setTickets] = useState([]);
    useEffect(() => ticketServices.findAllTickets()
        .then(tickets => setTickets(tickets)), []);

    // hooks for rendering the table
    const data = useMemo(
        () => tickets,
        [tickets],
    )

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Project',
                accessor: 'project',
            },
            {
                Header: 'Submitter',
                accessor: 'submitter',
            },
            {
                Header: 'Assigned Dev',
                accessor: 'assigned_developer',
            },
            {
                Header: 'Priority',
                accessor: 'priority',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Create Date',
                accessor: 'created_date',
            },
            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: ({ row }) => {
                    return (
                        <Details row={row.original} />
                    )
                }
            }
        ],
        [],
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data, defaultColumn: { Filter: DefaultColumnFilter } }, useFilters, useSortBy)

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'20px'}
            padding={'10px'}>
            <Table {...getTableProps()}>
                <Thead>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    isNumeric={column.isNumeric}
                                >
                                    <Box>
                                        {column.render('Header')}
                                        <chakra.span pl='4'>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <TriangleDownIcon aria-label='sorted descending' />
                                                ) : (
                                                    <TriangleUpIcon aria-label='sorted ascending' />
                                                )
                                            ) : null}

                                        </chakra.span>
                                    </Box>

                                    <Filter column={column} />
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <Tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                        {cell.render('Cell')}
                                    </Td>
                                ))}
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Box>

    )
}

export default TicketsPage
