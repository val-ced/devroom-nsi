import React, { useState } from 'react'
import { useGetUserQuery } from '../redux/api/api';

const GetUser: React.FC = () => {
  const [at, setAt] = useState("");
  const { data, error, isLoading } = useGetUserQuery(at, { skip: at.length < 1 })

  const query = (at: string) => {
    setAt(at)
  }

  return (
    <>
      <input value={at} onChange={(e) => query(e.currentTarget.value)} />
      {isLoading && <p>Loading</p>}
      {error && <p>{(error as any).data!.detail}</p>}
      {data && <p>{data.username}</p>}
    </>
  )
}

export default GetUser