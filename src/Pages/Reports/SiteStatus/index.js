                <div className="crawler-form">
                    <TextInput placeholder="Enter Website" onChange={(e) => setWebsite(e.target.value)} />
                    <Select defaultValue={defaultValue} key={""} items={domains?.map((d) => {
                        return d.domain;
                    })} onChange={
                        (e) => {
                            setWebsite(e);
                            setDefaultValue(e);
                        }
                    } />
                    <Button className="crawl-cta" onClick={crawlWebsite}>Crawl Website</Button>
                </div>

                {
                    websiteStatus === "Crawled" && <p>Found {data?.length} cookies on your website.</p>
                }

                url: "https://" + website
            if(res === "Err_Invalid_Website"){
                setWebsiteStatus("Invalid Website");
                setLoading(false);
                return;
            }
            setWebsiteStatus("Crawled");
