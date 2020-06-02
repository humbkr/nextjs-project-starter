import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'

const Homepage: React.FC = () => (
  <>
    <Head>
      <title>Next.js project starter</title>
    </Head>
    <main>
      <Title>You are now ready to code! :)</Title>
    </main>
  </>
)

export default Homepage

const Title = styled.h1`
  font-size: 2rem;
`
