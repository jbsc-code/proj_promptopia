'use client'

import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.length > 0 && data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [posts, setPosts] = useState([])

  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState([])

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt')
    const data = await response.json()

    setPosts(data)
  }

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, 'i')

    return posts.filter((item) => regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt))
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)

        if (e.target.value.length > 0) {
          setSearchedResults(searchResult)
        } else {
          fetchPosts()
        }
      }, 500)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompts(tagName)
    setSearchedResults(searchResult)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    setPosts(searchedResults)
  }, [searchedResults])

  return (
    <section className="feed">
      <div className="relative w-full flex-center">
        <input 
          type="text" 
          placeholder="Search for a tag or a username" 
          value={searchText} 
          onChange={handleSearchChange} 
          className="search_input peer"
        />
      </div>

      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed