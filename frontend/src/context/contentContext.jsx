import { createContext, useContext, useState } from "react";

/*There are 4 contents of this website: SightSeeing, Travel, Stay, Food */
/*Each time the content is changed, we might need rerender */



// this mock data changed to api call
const contents = ['sightSeeing', 'travel', 'stay', 'food'];

const ContentContext = createContext();

export const ContentProvider = ({children}) => {
    const [content, setContent] = useState(contents[0]);

    return (
        <ContentContext.Provider value={{content, setContent}}>
            {children}
        </ContentContext.Provider>
    )
}

export const useContent = () => useContext(ContentContext);