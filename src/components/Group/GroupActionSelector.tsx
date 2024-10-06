import * as React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { useGetGroupByIdQuery } from '../../features/apiSlice'
import GroupAddForm from './GroupAddForm'
import { selectGroupSelected, selectGroupShowForms } from '../../features/groupSlice'
import GroupDeleteForm from './GroupDeleteForm'
import GroupEditForm from './GroupEditForm'
import GroupDetail from './GroupDetail'

const GroupActionSelector = () => {
  const groupSelected = useSelector(selectGroupSelected)
  const groupShowForms = useSelector(selectGroupShowForms)
  const {
    data: group,
    isUninitialized,
    isFetching,
  } = useGetGroupByIdQuery(_.toInteger(groupSelected[0]), {
    skip: groupSelected.length === 1 ? false : true,
  })

  const groupIsValid = group && !isUninitialized && !isFetching

  return (
    <>
      {groupShowForms.detail && groupIsValid ? <GroupDetail group={group} /> : ''}
      {groupShowForms.edit && groupIsValid ? <GroupEditForm group={group} /> : ''}
      {groupShowForms.delete && groupIsValid ? <GroupDeleteForm group={group} /> : ''}
      {groupShowForms.add ? <GroupAddForm /> : ''}
    </>
  )
}

export default GroupActionSelector
