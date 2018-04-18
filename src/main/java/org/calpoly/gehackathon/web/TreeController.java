package org.calpoly.gehackathon.web;

import org.calpoly.gehackathon.domain.Tree;
import org.calpoly.gehackathon.repositories.JpaTreeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

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
    @ResponseBody
    public Iterable<Tree> trees() {
        return repository.findAll();
    }

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insertTree() {
        Tree t1 = new Tree("t1", "type1", 100.00, 200.00);
        repository.save(t1);
        return "Saved a tree = " + t1.getId();
    }

    @RequestMapping(value = "/insertTreeClass", method = RequestMethod.POST)
    public String insertTreeClass(@RequestBody Tree tree) {
        repository.save(tree);
        return "Saved a tree = " + tree.getId();
    }

    @RequestMapping(value = "/insertTreeClasses", method = RequestMethod.POST)
    public String insertTreeClasses(@RequestBody ArrayList<Tree> trees) {
        repository.save((Iterable<Tree>) trees);
        return "Saved number of trees = " + trees.size();
    }
}