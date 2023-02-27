import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import usePagination from '@mui/material/usePagination'
import { useSelector } from 'react-redux'
import { useMedia } from 'react-use'
import styled from '@emotion/styled'
import { Button, Typography, IconButton } from '@mui/material'
import { FlexColumn } from '../Layout'
import { createStyles, makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import ProgressBar from '../ProgressBar'
import { Card } from '../Card'
import { light, dark } from '../../theme'
import styles from './index.module.scss'
import searchIcon from '../../assets/icons/search.svg'
import info from '../../assets/icons/info.svg'
import forward from '../../assets/icons/forward.svg'
import backward from '../../assets/icons/backward.svg'
import { Stack } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { FilterList, Close } from '@mui/icons-material'
import OutlinedInput from '@mui/material/OutlinedInput'
// custom components
import ProjectInfoModal from '../ViewInfoModal'
import api from '../../apis'
import ProjectTableRow from './ProjectTableRow'

const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'center'
})

const MobileList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const BlackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black
}))

const BlackIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.black
}))

const PrimaryIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}))

const BlackFilterList = styled(FilterList)(({ theme }) => ({
  color: theme.palette.common.black
}))

//const filterlist = ['pending', 'active', 'active_open', 'inactive', 'cancelled', 'user_cancelled']

// updated filterlist to use labels and status groups
const filterlist = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: ['active', 'active_open'] },
  { label: 'Inactive', value: 'expired' },
  { label: 'Cancelled', value: ['cancelled', 'user_cancelled'] },
];


const StyledPagination = props => {
  const { items, curPage, length, setPage } = props
  const classes = useStyles()
  const mobile = useMedia('(max-width: 576px)')
  const mode = useSelector(state => state.toogle.darkMode)
  const theme = mode === 'true' ? dark : light

  return (
    <nav className={`${styles.footer}`}>
      {mobile ? (
        <MobileList>
          <BlackButton
            className={`${styles.arrow}`}
            onClick={() => setPage(curPage <= 1 ? curPage : curPage - 1)}
            startIcon={<img src={backward} alt="backward" />}
          ></BlackButton>
          <Typography variant="p" color="common.black">
            Page {curPage} of {Math.ceil(length / 10) + (length === 0 ? 1 : 0)}
          </Typography>
          <BlackButton
            className={`${styles.arrow}`}
            onClick={() =>
              setPage(
                curPage > Math.ceil(items.length / 10) ? curPage : curPage + 1
              )
            }
            startIcon={<img src={forward} alt="forward" />}
          ></BlackButton>
        </MobileList>
      ) : (
        <List>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null

            if (type === 'start-ellipsis' || type === 'end-ellipsis') {
              children = (
                <BlackIconButton className={`${styles.page}`}>
                  …
                </BlackIconButton>
              )
            } else if (type === 'page') {
              children = (
                <PrimaryIconButton
                  onClick={() => setPage(page)}
                  className={`${styles.page} ${
                    curPage === page && styles.active
                  }`}
                >
                  {page}
                </PrimaryIconButton>
              )
            } else {
              children = (
                <BlackButton
                  className={`${styles.arrow}`}
                  onClick={() =>
                    type === 'previous'
                      ? setPage(curPage <= 1 ? curPage : curPage - 1)
                      : setPage(
                          curPage >= Math.ceil(length / 10)
                            ? curPage
                            : curPage + 1
                        )
                  }
                  startIcon={
                    type === 'previous' && (
                      <img
                        src={backward}
                        width="21px"
                        height="21px"
                        alt="backward"
                        className={styles.mb2}
                      />
                    )
                  }
                  endIcon={
                    type === 'next' && (
                      <img
                        src={forward}
                        width="21px"
                        height="21px"
                        alt="forward"
                        className={styles.mb2}
                      />
                    )
                  }
                >
                  {!mobile && (
                    <span className={classes.pageBtn}>
                      {type === 'previous' ? 'Previous' : 'Next'}
                    </span>
                  )}
                </BlackButton>
              )
            }

            return (
              <li
                key={index}
                className={`${
                  type === 'previous'
                    ? styles.left
                    : type === 'next'
                    ? styles.right
                    : ''
                }`}
              >
                {children}
              </li>
            )
          })}
        </List>
      )}
    </nav>
  )
}

const useStyles = makeStyles(theme =>
  createStyles({
    sticky: {
      position: 'sticky',
      right: 0,
      background: theme.palette.info.dark,
      padding: '3px 10px'
    },
    cell: {
      width: '86px !important',
      borderBottom: `1px solid ${theme.palette.divider} !important`,
      whiteSpace: 'nowrap',
      textAlign: 'left',
      [theme.breakpoints.up(960)]: {
        width: '15% !important'
      }
    },
    rowInline: {
      [theme.breakpoints.up(960)]: {
        maxHeight: '66px !important',
        display: 'inline !important'
      }
    },
    bottomDiv: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    filtSelect: {
      backgroundColor: theme.palette.secondary.main,
      textAlign: 'center',
      color: 'white'
    },
    search: {
      height: '40px',
      width: '400px',
      fontSize: '14px',
      background: theme.palette.secondary.main,
      borderColor: theme.palette.background.default,
      borderRadius: '8px',
      [theme.breakpoints.down(960)]: {
        width: '100%'
      }
    },
    stacks: {
      [theme.breakpoints.down(960)]: {
        minWidth: '100%',
        flexWrap: 'wrap'
      }
    },
    filtText: {
      color: theme.palette.text.primary,
      fontSize: '14px !important',
      [theme.breakpoints.up(960)]: {
        display: 'none'
      }
    },
    icon: {
      borderRadius: '6px !important'
    },
    pageBtn: {
      fontSize: '14px !important'
    },
    filterList: {
      [theme.breakpoints.down(960)]: {
        width: '20px',
        height: '20px'
      }
    }
  })
)

const StyledTable = props => {
  const [response, setResponse] = useState([])

  const { theme, modalOpen, setModalOpen, allUserProjects = [] } = props
  const [search, setSearch] = useState('')
  const [toFilter, setToFilter] = useState([])
  const [fromFilter, setFromFilter] = useState([
    { label: 'Pending', value: 'pending' },
    { label: 'Active', value: ['active', 'active_open'] },
    { label: 'Inactive', value: 'expired' },
    { label: 'Cancelled', value: ['cancelled', 'user_cancelled'] },
  ]);
  const classes = useStyles()
  const filteredList = response.filter(
    data =>
      data.projectId.startsWith(search) &&
      (toFilter.length > 0 ? toFilter.includes(data.status) : 1)
  )
  const { items } = usePagination({
    count: Math.ceil(filteredList.length / 10)
  })
  const [page, setPage] = useState(1)
  const [projectInfo, setProjectInfo] = useState(null)

  useEffect(() => {
    const init = async () => {
      let newResponse = await Promise.all(
        allUserProjects.map(async (project, index) => {
          const { api_tokens, api_tokens_used, status } = (
            await api.project.getProjectStats({
              projectId: project.project_id,
              apiKey: project.api_key
            })
          )?.data?.result || {}
          // console.log('api tokens:', { api_tokens, api_tokens_used })
          if (api_tokens !== 'N/A' && api_tokens_used !== 'N/A') {
            return {
              ...project,
              projectId: project.project_id,
              apiKey: project.api_key,
              expires: 'Oct 24, 2022',
              status,
              usage: (Number(api_tokens_used) * 100) / Number(api_tokens)
            }
          }
          return project
        })
      )
      setResponse([...newResponse])
    }
    init()
  }, [allUserProjects])

  const handleChange = event => {
    const value = event.target.value;
    if (value === 0) {
      setToFilter([]);
    } else {
      const selectedFilter = fromFilter[value - 1];
      if (Array.isArray(selectedFilter.value)) {
        setToFilter([...toFilter, ...selectedFilter.value]);
      } else {
        setToFilter([...toFilter, selectedFilter.value]);
      }
    }
  };

  const handleDelete = newValue => {
    let fromTemp = fromFilter
    let toTemp = toFilter

    fromTemp.push(newValue)
    setFromFilter(fromTemp)
    toTemp = toFilter.filter(item => item !== newValue)
    setToFilter(toTemp)
  }

  const handleGetInfo = async (projectId, apiKey) => {
    try {
      const response = await api.project.getProjectStats({ projectId, apiKey })
      setProjectInfo(response.data.result)
      setModalOpen(true)
    } catch (error) {
      toast(`Backend server error occured: ${error?.message}`)
    }
  }

  const filterTags = () => {
    return (
      <>
        {toFilter.map(item => {
          return (
            <button className={styles.toFilterBtn}>
              {item}{' '}
              <Close
                className={styles.closeIcon}
                onClick={() => handleDelete(item)}
              />
            </button>
          )
        })}
      </>
    )
  }

  return (
    <Card className={`${styles.mt10}`}>
      <div className={`${styles.header} ${classes.bottomDiv}`}>
        <FlexColumn>
          <Typography
            variant="h3"
            color="common.black"
            className={`${styles.title}`}
          >
            Your Projects
          </Typography>
        </FlexColumn>
      </div>
      <div className={`${styles.filter} ${classes.bottomDiv}`}>
        <OutlinedInput
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className={classes.search}
          id="outlined-adornment-amount"
          placeholder="Search by name or project ID"
          startAdornment={<img src={searchIcon} alt="search" />}
        />

        <Stack
          className={`${classes.stacks} ${styles.gap10}`}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <div className={styles.tag1}>{filterTags()}</div>
          <Select
            id="demo-simple-select-autowidth"
            value={0}
            className={`${styles.filtSelect} ${classes.filtSelect}`}
            onChange={handleChange}
            sx={{
              '.MuiSvgIcon-root.MuiSelect-iconOutlined': {
                display: 'none !important'
              },
              '.css-i4bv87-MuiSvgIcon-root': { color: 'warning.main' },
              color: 'transparent'
            }}
          >
            <MenuItem value={0} className={styles.hidden}>
              <div className={`${styles.flexCenter} ${classes.icon}`}>
                <BlackFilterList className={classes.filterList} />
                <span className={classes.filtText}>Filter</span>
              </div>
            </MenuItem>
            {filterlist.map((filter, index) => (
              <MenuItem key={index} value={index + 1}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>
          <div className={styles.tag2}>{filterTags()}</div>
        </Stack>
      </div>
      {/* </div> */}

      <TableContainer className={styles.tableContainer}>
        <Table
          className={`${classes.table} ${classes.fixedTable}`}
          aria-label="simple table"
        >
          <TableBody>
            {filteredList
              .slice((page - 1) * 10, page * 10)
              .map((data, index) => (
                <ProjectTableRow 
                  data={data} 
                  index={index} 
                  handleGetInfo={handleGetInfo}
                  useStyles={useStyles}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StyledPagination
        items={items}
        curPage={page}
        length={filteredList.length}
        setPage={setPage}
      />

      <ProjectInfoModal
        projectInfo={projectInfo}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </Card>
  )
}

export default StyledTable
