//pages/_app.tsx
//
'use client'
import styles from "../page.module.css";

import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import Link from 'next/link'

Amplify.configure(config);

function App({ signOut, user }: WithAuthenticatorProps) {
  return (
    <main className={styles.main}>
      <>
        <h1>Hello {user?.username}</h1>
        <button onClick={signOut}>Sign out</button>
        <Link href="/">Take me to the home</Link>
      </>
    </main>
  );
}

export default withAuthenticator(App);
