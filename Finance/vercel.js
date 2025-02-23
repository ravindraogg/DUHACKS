{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=0, must-revalidate" }
      ]
    }
  ],
  "redirects": [],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
