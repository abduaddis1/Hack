'use client'

import LinkComponent from './PlaidMainScreen'
import { QuickstartProvider } from "./context"

const App = () => {

  return (
    <QuickstartProvider>
      <LinkComponent />
    </QuickstartProvider> 
  );
};

export default App;

