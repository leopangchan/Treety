package org.cloudfoundry.samples.music.web;

import org.cloudfoundry.samples.music.domain.Tree;
import org.cloudfoundry.samples.music.repositories.jpa.JpaTreeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/tree")
public class TreeController {
    private static final Logger logger = LoggerFactory.getLogger(TreeController.class);
    private JpaTreeRepository repository;

    @Autowired
    public TreeController(JpaTreeRepository repository) {
        this.repository = repository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Iterable<Tree> trees() {
        return repository.findAll();
    }
/*
    @RequestMapping(method = RequestMethod.PUT)
    public Tree add(@RequestBody @Valid Tree album) {
        logger.info("Adding album " + album.getId());
        return repository.save(album);
    }

    @RequestMapping(method = RequestMethod.POST)
    public Tree update(@RequestBody @Valid Tree album) {
        logger.info("Updating album " + album.getId());
        return repository.save(album);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Tree getById(@PathVariable String id) {
        logger.info("Getting album " + id);
        return repository.findOne(id);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteById(@PathVariable String id) {
        logger.info("Deleting album " + id);
        repository.delete(id);
    }*/
}